# Dockerfile recomendado para este proyecto Node (usa Node 20 por tu engines)
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia sólo package.json y package-lock (si existe) para aprovechar cache
COPY package*.json ./

# Si tienes package-lock.json puedes usar npm ci; si no, npm install:
# RUN npm ci --only=production
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --production; fi

# Copia el resto de archivos
COPY . .

# Puerto que usa la app
EXPOSE 3000

# Comando por defecto
CMD ["node", "src/server.js"]
