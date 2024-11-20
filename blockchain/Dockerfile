# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala ganache-cli globalmente
RUN npm install -g ganache

RUN apk add curl

RUN apk add libc6-compat

# Puerto por defecto para Ganache
EXPOSE 8545

# Comando para iniciar Ganache
CMD ["ganache", "--host", "0.0.0.0", "--port", "8545", "--networkId", "5777", "--mnemonic", "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", "--accounts", "10", "--defaultBalanceEther", "1000", "--db", "/app/ganache-data"]
