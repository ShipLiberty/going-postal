import { NgModule }              from '@angular/core';
import { BrowserModule }         from '@angular/platform-browser';
import { ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }            from '@angular/http';
import { FormsModule }           from '@angular/forms';

import { AppComponent }          from './app.component';
import { SearchComponent }       from './search/search.component';
import { SelectComponent }       from './select/select.component';
import { LetterComponent }       from './letter/letter.component';
import { HeaderComponent }       from './header/header.component';
import { FooterComponent }       from './footer/footer.component';
import { BreadcrumbsComponent }  from './breadcrumbs/breadcrumbs.component';
import { ReviewAndPayComponent } from './review_and_pay/review_and_pay.component';
import { MissionComponent }      from './mission/mission.component';
import { LandingFAQComponent }   from './landing_faq/landing_faq.component';
import { ShippedComponent }      from './shipped/shipped.component';

import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    SelectComponent,
    LetterComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    ReviewAndPayComponent,
    MissionComponent,
    LandingFAQComponent,
    ShippedComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig }
  ]
})

export class AppModule { }
