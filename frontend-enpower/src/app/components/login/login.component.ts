import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Cambiado de styleUrl a styleUrls
})
export class LoginComponent {
  login() {
    const clientId = 'frontend'; // Reemplaza con tu client_id
    const redirectUri = ('http://localhost:4200/callback');
    const keycloakAuthUrl = `http://localhost:8180/auth/realms/market-app/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;

    console.log(keycloakAuthUrl);
    // Redirige a la URL de autenticación de Keycloak
    window.location.href = keycloakAuthUrl;
  }
}
