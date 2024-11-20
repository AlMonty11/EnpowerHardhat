// src/app/keycloak.service.ts
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class KeycloakInitService {
  constructor(private keycloakService: KeycloakService) {}

  init(): Promise<any> {
    return this.keycloakService.init({
      config: {
        url: 'http://localhost:8180/auth', // Keycloak server URL
        realm: 'market-app',
        clientId: 'frontend',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    });
  }
}
