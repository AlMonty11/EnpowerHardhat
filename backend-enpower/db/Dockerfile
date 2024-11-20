# Usa la imagen oficial de MongoDB como base
FROM mongo:latest

# Crea un directorio para los datos de MongoDB
RUN mkdir -p /data/db

# Copia cualquier archivo de configuración adicional si es necesario
# COPY ./config/mongod.conf /etc/mongod.conf

# Expone el puerto de MongoDB
EXPOSE 27017

# Comando para iniciar MongoDB
CMD ["mongod"]
