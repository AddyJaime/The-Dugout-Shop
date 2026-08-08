FROM node:22-alpine

WORKDIR /app
#instalar pnpm ya que alpine no lo trae por default
RUN npm install -g pnpm@10.30.3
# esto queda en el fodler dentro del contendor asi ./app/ depe
COPY pnpm-lock.yaml pnpm-workspace.yaml  ./ 
# esto va tambien dentro del contendor en el fodler raiz ./app
COPY package.json ./

COPY  turbo.jsonc  ./

COPY tsconfig.base.json ./
# y este va dentro del conento pero en un fodler ./apps/auth-service, IMPORTANTE EL / AL FINAL LE DICE QUE ES UNA CARPETA, SI NO LO ESCRIBO LO DEJA COMO UN FILE
COPY apps/auth-service/package.json ./apps/auth-service/
# installar depe solo de este workspace
RUN pnpm install --filter @the-dugout-shop/auth-service 
# copiar todo a el el contendor 
COPY apps/auth-service  ./apps/auth-service/

#compilar a js ahora 
RUN pnpm run build --filter @the-dugout-shop/auth-service


#Usas node y no pnpm dev porque en producción no
#quieres el compilador de TypeScript ni el auto-reload
# — quieres correr el JavaScript ya compilado
# directamente. Es más rápido y más limpio.
CMD [ "node", "apps/auth-service/dist/index.js" ]