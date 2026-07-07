// El tipo que estás creando describe los datos que
// llegan en el request algunos opcionales otros requeridos
// Porque en Prisma schema es un lenguaje propio — no
// es TypeScript. Prisma usa String con mayúscula como
// su propio tipo por eso estos tipos van en minuscula

export type CreateProfileInput = {
  keycloak_id: string;
  favorite_team_id?: string;
  shipping_street?: string;
  shipping_apt?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
};
// buscar un perfil en la db
export type GetProfileInput = {
  keycloak_id: string;
};
// para atualizar el perfil algunos opciones porque el usuario puedde solo actualziar uno
export type UpdateProfileInput = {
  keycloak_id: string;
  favorite_team_id?: string;
  shipping_street?: string;
  shipping_apt?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
};
