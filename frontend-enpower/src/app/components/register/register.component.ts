import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import * as argon2 from 'argon2';
import { ethereumAddressValidator } from '../../validators/ethereumAddress.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup; // Usar el operador de aserción no nulo
  registerError: string ="";

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      walletAddress: ['', ethereumAddressValidator() ],
      // walletPublicKey: ['', Validators.required],
      // walletPrivateKey: ['', Validators.required],
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get walletAddress() {
    return this.registerForm.get('walletAddress');
  }

  // get walletPrivateKey() {
  //   return this.registerForm.get('walletPrivateKey');
  // }

  // get walletPublicKey() {
  //   return this.registerForm.get('walletPublicKey');
  // }

  

  async register() {
    console.log('hola');
    //this.userService.register(this.username?.value, this.email?.value, this.password?.value,  this.walletAddress?.value, this.walletPrivateKey?.value, this.walletPublicKey?.value).subscribe({
    this.userService.register(this.username?.value, this.email?.value, this.password?.value,  this.walletAddress?.value).subscribe({
      next: response => {
        console.log('User registered:', response);
        this.registerForm.reset();
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.log(error);
        this.registerError = error;
        // this.router.navigateByUrl('/??');
      },
      complete: () => {
        //this.router.navigateByUrl('/??');
        this.registerForm.reset();
      }
    });
  }
}
