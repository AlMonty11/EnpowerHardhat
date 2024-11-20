// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(username: string, email:string, password: string, walletAddress: string): Observable<any> {
  //register(username: string, email:string, password: string, walletAddress: string, walletPublicKey: string, walletPrivateKey: string): Observable<any> {

    return this.http.post(`${this.apiUrl}/register`, { username, email, password, walletAddress});
    //return this.http.post(`${this.apiUrl}/register`, { username, email, password, walletAddress, walletPublicKey, walletPrivateKey });

  }

  health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  checkUserWallet(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/wallet`, { username });
  }

  getWalletInfo(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wallet-info/${username}`);
  }  

  createWallet(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-wallet`, { username });
  }
  
  addWalletAddress(username: string, walletAddress: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-wallet-address`, { username, walletAddress });
  }
}
