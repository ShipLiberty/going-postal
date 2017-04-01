import { NgModule }              from '@angular/core';
import { BrowserModule }         from '@angular/platform-browser';
import { ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }            from '@angular/http';
import { FormsModule }           from '@angular/forms';

import { AppComponent }          from './app.component';
import { SelectComponent }       from './select/select.component';
import { LetterComponent }       from './letter/letter.component';
import { HeaderComponent }       from './header/header.component';
import { FooterComponent }       from './footer/footer.component';

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
    SelectComponent,
    LetterComponent,
    HeaderComponent,
    FooterComponent
  ],
  bootstrap: [ 
    AppComponent 
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig }
  ]
})

export class AppModule { }
