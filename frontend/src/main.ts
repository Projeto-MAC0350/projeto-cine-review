import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core'
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { StarRatingModule }    from 'angular-star-rating';
import { ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(StarRatingModule, ReactiveFormsModule),
    ...appConfig.providers
    ]
  })
  .catch(err => console.error(err));
