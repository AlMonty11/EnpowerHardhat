import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';
import { WalletStatusComponent } from './wallet-status/wallet-status.component';
import { ContractInteractComponent } from './contract-interact/contract-interact.component';

export const routes: Routes = [
    {path:'',redirectTo:'/home',pathMatch:'full'},
    {path: 'home', component:HomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'callback', component: CallbackComponent },
    {path: 'wallet', component: WalletStatusComponent},
    {path: 'contract-interact', component: ContractInteractComponent },
];
