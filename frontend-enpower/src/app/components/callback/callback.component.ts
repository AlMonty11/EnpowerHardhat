import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HomeComponent } from "../home/home.component";



@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'] // Corrige `styleUrl` a `styleUrls`
})
export class CallbackComponent implements OnInit {
 
  codeHandled = false; 

  constructor(
      private route: ActivatedRoute, 
      private http: HttpClient, 
      private router: Router,
      private userService : UserService
    ) 
      { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const sessionState = params['session_state']; // Renombrado para mayor claridad
  
      console.log('Session State:', sessionState);
      console.log('Authorization Code:', code);
  
      if (code  && !this.codeHandled) {
        this.codeHandled = true;
        this.handleAuthorizationCode(code);
      }
    });
  }
  
  private handleAuthorizationCode(code: string) {
    console.log(code);
    this.http.post('http://localhost:3000/auth/callback', {code})
      .subscribe({
        next: response => {
          console.log(response)
          this.storeAuthData(response);
          this.router.navigateByUrl('/home');

        },
        error: error => {
          console.error('Error in POST request:', error);
          // Maneja el error según sea necesario, como mostrar un mensaje al usuario
        },

      });
  }
  
  private storeAuthData(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('roles', response.roles);
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email);
    localStorage.setItem('refresh_token', response.refresh_token)

  }
}
