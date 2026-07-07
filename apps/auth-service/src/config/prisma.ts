// prismaClient se crea con npx prisma generate se utiliza para poder utilizar los metodos y tipos como create update etc, cuando se importa prismaCLinet hay que especificarle la carpeta dentro del prisma
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

// Antes de Prisma 7, Prisma traía su propio driver
// interno para conectarse a PostgreSQL — tú solo
// ponías el DATABASE_URL y Prisma manejaba todo por
// dentro.

// En Prisma 7 cambiaron eso: ya no incluyen el driver
// de PostgreSQL por dentro. Ahora tú tienes que darle
// explícitamente un "puente" que sepa hablar con
// Postgres.
