FROM quay.io/keycloak/keycloak:15.0.2

# Expone el puerto de Keycloak
EXPOSE 8080

# Añadir el usuario admin antes de iniciar Keycloak
RUN /opt/jboss/keycloak/bin/add-user-keycloak.sh -u admin -p admin
