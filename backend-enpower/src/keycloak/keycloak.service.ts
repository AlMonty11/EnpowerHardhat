// src/keycloak/keycloak.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';

@Injectable()
export class KeycloakService {
  private keycloakUrl = `http://${process.env.KEYCLOAK_IP}:8180`; // Cambia la URL de Keycloak
  private realm = process.env.KEYCLOAK_REALM; // Cambia por tu realm
  private keycloakCreateUserUrl = `${this.keycloakUrl}/auth/admin/realms/${this.realm}/users`;
  private clientId = process.env.KEYCLOAK_CLIENT_ID; // Cambia por tu client_id de Keycloak
  private clientSecret = process.env.KEYCLOAK_CLIENT_SECRET; // Cambia por el client_secret
  private adminUsername = process.env.KEYCLOAK_ADMIN_USERNAME; // El nombre de usuario del admin
  private adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD; // La contraseña del admin

  // Método para obtener un token de acceso desde Keycloak
  async getAccessToken() {
    // const tokenResponse = await axios.post(`http://${process.env.KEYCLOAK_IP}:8180/auth/realms/market-app/protocol/openid-connect/token`,
    //   qs.stringify({
    //     client_id: 'frontend',
    //     client_secret: this.clientSecret,
    //     grant_type: 'authorization_code',
    //     redirect_uri: `http://${process.env.FRONTEND_IP}:4200/callback`,
    //     code: body,
    //   }), {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //   }
    // );
    const token = localStorage.getItem('access_token');
    console.log('Token de acceso obtenido:', token);

    return token;
  }

  async getAdminToken() {
    try {
      const response = await axios.post(
        `${this.keycloakUrl}/auth/realms/master/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: this.adminUsername,
          password: this.adminPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Devuelve el token de acceso de administrador
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener el token de administrador:', error);
      throw error;
    }
  }

  // Método para crear un usuario en Keycloak
  async createUserInKeycloak(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    const adminToken = await this.getAdminToken();
    console.log('Access_token: ' + adminToken);
    try {
      console.log(username, email, password);
      console.log(this.keycloakUrl, this.keycloakCreateUserUrl);
      console.log('LLEGA HASTA AQUI');

      return await axios.post(
        this.keycloakCreateUserUrl,
        {
          enabled: true,
          attributes: {},
          groups: [],
          username: username,
          email: email,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error en la solicitud a Keycloak:',
          error.response?.data,
          error.message,
          error.config,
          error.request,
        );
      } else {
        console.error('Error inesperado:', error);
      }
      throw new Error('No se pudo crear el usuario en Keycloak');
    }
  }
}
