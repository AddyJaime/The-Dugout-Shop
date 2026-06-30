// ============================================================
// AUTH FLOW — verifyToken
// ============================================================
// JWT es un token que prueba que un usuario se autenticó con
// Keycloak y tiene permiso de acceder a la app.
// jwks-rsa obtiene la clave pública de Keycloak para verificar
// la firma de ese token.
// ============================================================

import jwt from "jsonwebtoken";
import JwksRsa from "jwks-rsa";

import { Request, Response, NextFunction } from "express";

// ============================================================
// PASO 1 — crear el client (pasa UNA SOLA VEZ al arrancar la app)
// ============================================================
// El client es un "mensajero" configurado con la URL de Keycloak.
// Crear el client NO hace ningún request todavía — solo lo deja
// listo para cuando se lo pidamos.
//
// jwksUri → endpoint donde Keycloak expone sus llaves públicas
// cache → guarda llaves en memoria para no pedirlas cada vez
// rateLimit / jwksRequestsPerMinute → evita saturar a Keycloak
// timeout → cuánto espera antes de rendirse
// ============================================================
const client = JwksRsa({
  jwksUri:
    "http://localhost:8080/realms/the-dugout-shop/protocol/openid-connect/certs",
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  timeout: 3000,
});

async function verifyToken(token: string) {
  // ============================================================
  // PASO 2 — el usuario ya hizo login y nos manda el JWT
  // ============================================================
  // El usuario se autenticó en Keycloak, Keycloak firmó un JWT
  // con su llave privada y se lo entregó. Ahora el usuario nos
  // manda ese JWT en el header Authorization de cada request.
  //
  // JWT tiene 3 partes: header.payload.signature
  // - header    → tiene el kid y el algoritmo
  // - payload   → datos del usuario (id, email, roles, etc.)
  // - signature → la firma de Keycloak que vamos a verificar
  // ============================================================

  // ============================================================
  // PASO 3 — decodificar el token SIN verificar todavía
  // ============================================================
  // jwt.decode() solo desempaca el token para poder leer el
  // header. No confirma si es legítimo, eso pasa después.
  // ============================================================
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded) throw new Error("invalid token");

  // ============================================================
  // PASO 4 — extraer el kid
  // ============================================================
  // kid = ID del par de llaves que Keycloak usó para firmar.
  // Keycloak puede tener varias llaves (las rota), así que el
  // kid le dice a tu app exactamente cuál llave pública pedir.
  // ============================================================
  const kid = decoded.header.kid;

  // ============================================================
  // PASO 5 — pedirle al client la llave pública correspondiente
  // ============================================================
  // Aquí es donde el client REALMENTE hace el trabajo: va al
  // jwksUri configurado en el Paso 1, busca entre todas las
  // llaves públicas la que tiene este kid, y la trae.
  // ============================================================
  const signingKey = await client.getSigningKey(kid);
  const publicKey = signingKey.getPublicKey();

  // ============================================================
  // PASO 6 — verificar la signature con la llave pública
  // ============================================================
  // Solo la llave pública que corresponde matemáticamente a la
  // llave privada de Keycloak puede verificar esta signature.
  // Si coincide → el JWT es legítimo y nadie lo modificó.
  // Si no coincide → jwt.verify() lanza un error automáticamente.
  // ============================================================
  const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

  return payload;
}

// verifyToken es una función normal — si lanza un error, el que la
//   llamó decide qué hacer con él.

//   authenticateToken es un middleware Express — Express lo llama
//   internamente, no tu código. Si lanzas un error ahí, Express no
//   sabe qué hacer con él a menos que tengas un error handler
//   configurado, y el request puede quedar colgado o devolver un 500
// genérico.
// En un middleware, tú eres el responsable de responder directamente
// con res.status() o pasar el control con next(). Express no maneja
// tus throws automáticamente.
async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // ?. → por si no viene el header, no explota solo sale undefine
  const token = req.headers.authorization?.split(" ")[1];
  // en este middleware lo mejor es responder con un error no thow an error o puede crashear tood
  if (!token) {
    res.status(401).json({ message: "invalid token" });
    return;
  }

  try {
    const payload = await verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
}

export default authenticateToken;
