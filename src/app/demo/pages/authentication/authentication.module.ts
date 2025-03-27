import { NgModule } from '@angular/core';



import { AuthenticationRoutingModule } from './authentication-routing.module';
import LoginComponent from './login/login.component';
import RegisterComponent from './register/register.component';





@NgModule({
  // declarations: [],
  imports: [
    AuthenticationRoutingModule,
    LoginComponent,
    RegisterComponent,
  ]
})
export class AuthenticationModule {}
