import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import {  provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import {ToastrModule } from 'ngx-toastr';
// import { CalendarModule } from 'primeng/calendar';
// import { providePrimeNG } from 'primeng/config';





if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      CommonModule,
      BrowserAnimationsModule,
      // CalendarModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),

    ),
    provideAnimations(),
    provideHttpClient(),
    provideToastr(),
    // providePrimeNG({
    //   theme:'none'
    // })

  ]
}).catch((err) => console.error(err));
