import { NgModule }              from '@angular/core';
import { BrowserModule }         from '@angular/platform-browser';
import { ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }            from '@angular/http';
import { FormsModule }           from '@angular/forms';
import { RouterModule }          from '@angular/router';

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
import { TrackComponent }        from './track/track.component';
import { MainComponent }         from './main/main.component';

import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {path : '', component : MainComponent},
      {path : 'track', component : TrackComponent},
      {path : '**', component : AppComponent} //change to some kind of 404
    ])
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
    ShippedComponent,
    TrackComponent,
    MainComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig }
  ]
})

export class AppModule { }
