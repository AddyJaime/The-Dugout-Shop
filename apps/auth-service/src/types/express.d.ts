// a esto se le llama declaration merging se usa para extender el interface de Rewuest y poder agregar la nueva propiedad que es payload para que tp no se queje cuando la agreguemos en el middleware para poder utilizar req mas adelante
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        // sub: string es
        // exactamente lo que viene en el payload del JWT de
        // Keycloak.
        sub: string;
      };
    }
  }
}
