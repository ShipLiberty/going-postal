import { Component, OnInit }                  from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, URLSearchParams }              from '@angular/http';
import { SelectComponent }                    from './select.component';
import 'rxjs/add/operator/map';

@Component({
  selector   : 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css']
})

export class AppComponent  {
    //just some properties
    ApiBaseUrl = 'https://frozen-refuge-69652.herokuapp.com/v1/lookup'; 
    hidden     = '';
    reps: Array<any> = [];
    
    //called first time before the ngOnInit()    
    constructor(
        private http: Http
    ) {}
    
    //called after the constructor and called  after the first ngOnChanges() 
   /* ngOnInit(){

    }*/
    
    //form stuff, includes the properties and the validation
    form = new FormGroup({
            street : new FormControl('', Validators.required),
            city   : new FormControl('', Validators.required),
            state  : new FormControl('', Validators.required),
            zipcode: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^\\d{5}(?:[-\\s]\\d{4})?$')
            ])),
        });

    //function called on (form) submit
    onSubmit() {
        var address = '?address=' + this.form.controls['street'].value;
        var city    = '&city=' + this.form.controls['city'].value;
        var state   = '&state=' + this.form.controls['state'].value;
        var zip     = '&zip=' + this.form.controls['zipcode'].value;
    
        var getString = this.ApiBaseUrl + address + city + state + zip;
    
        //make the GET request for the representatives
        this.http.get(getString).subscribe(response => {
                this.reps = response.json();
                console.log(this.reps);
        })
    }
}
