import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { AppComponent }         from './app.component';
import { SelectComponent }      from './select.component';
import { LetterComponent }      from './letter.component';

@NgModule({
  imports: [ 
    BrowserModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [ 
    AppComponent,
    SelectComponent,
    LetterComponent
  ],
  bootstrap: [ 
    AppComponent 
  ]
})

export class AppModule { }
