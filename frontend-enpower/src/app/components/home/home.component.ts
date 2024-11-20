import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLoguedIn: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Inicializa `userLoguedIn` al cargar el componente
    this.userLoguedIn = !!localStorage.getItem('token');
  }

  login() {
    const clientId = 'frontend';
    const redirectUri = encodeURIComponent('http://localhost:4200/callback');
    const keycloakAuthUrl = `http://localhost:8180/auth/realms/market-app/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    // Redirige a Keycloak para iniciar sesión
    window.location.href = keycloakAuthUrl;
  }

  logout() {
    // ID del cliente de Keycloak
    const clientId = 'frontend';

    // URL de redirección tras el logout
    const redirectUri = encodeURIComponent('http://localhost:4200/callback');

    // Token de refresco, necesario para el logout en Keycloak
    const refreshToken = localStorage.getItem('refresh_token');

    // Construir la URL de logout de Keycloak con los parámetros necesarios
    const logoutUrl = `http://localhost:8180/auth/realms/market-app/protocol/openid-connect/logout?client_id=${clientId}&refresh_token=${refreshToken}&redirect_uri=${redirectUri}`;

    // Limpia el almacenamiento y cambia el estado a no logueado
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');

    this.userLoguedIn = false;

    // Redirige al usuario a la URL de logout de Keycloak
    window.location.href = logoutUrl;
  }


  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
