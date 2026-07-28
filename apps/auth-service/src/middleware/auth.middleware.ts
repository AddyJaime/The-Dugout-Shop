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
  jwksUri: process.env.KEYCLOAK_JWKS_URI!, //aqui se encuntran las llaves publicas, keycloak las publica para todo el mundo ahi

  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  timeout: 3000,
});

async function verifyToken(token: string) {
  // DECODIFICA (desempaca Base64, sin llave, sin verificar) para leer el header.
  // complete: true → devuelve header + payload + signature (no solo el payload).
  // Necesitamos el header porque ahí está el kid
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded) throw new Error("invalid token");

  // el indetificaro de que llave se uso para firmar este token
  // Entonces, cuando Keycloak firma un token, mete en el header "lo firmé con la llave tal"
  const kid = decoded.header.kid;

  // getSigningKey → va a /certs y trae la llave pública que tiene este kid.
  //   (aquí SÍ hay llamada de red, pero cache:true la guarda tras la 1ª vez)
  const signingKey = await client.getSigningKey(kid);
  // getPublicKey → saca esa llave como texto PEM, el formato que jwt.verify espera.
  const publicKey = signingKey.getPublicKey();

  const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

  return payload;
}

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // ?. → por si no viene el header, no explota solo sale undefine
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "invalid token" }); //si no hay token para aqui
    return;
  }

  try {
    const payload = await verifyToken(token);
    // confia en mi esto viene asi del payload, aqui estmaos
    // metiedo el payload dentro del interface request
    req.user = payload as { sub: string };

    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
}

export default authenticateToken;

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
