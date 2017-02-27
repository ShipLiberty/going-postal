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
    sender = {
        address  : '',
        address2 : '',
        city     : '',
        state    : '',
        zip      : 0
    };
    
    //called first time before the ngOnInit()    
    constructor(
        private http: Http
    ) {}
    
    /*
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){

    }*/
    
    //form stuff, includes setting the properties and the validation
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
    
        //set the sender object details
        this.sender.address = this.form.controls['street'].value;
        this.sender.city    = this.form.controls['city'].value;
        this.sender.state   = this.form.controls['state'].value;
        this.sender.zip     = this.form.controls['zipcode'].value;
        
        //lookup GET request endpoint string buildup
        var address = '?address=' + this.sender.address;
        var city    = '&city='    + this.sender.city;
        var state   = '&state='   + this.sender.state;
        var zip     = '&zip='     + this.sender.zip;
    
        var getString = this.ApiBaseUrl + address + city + state + zip;
    
        //GET request for the representatives
        this.http.get(getString).subscribe(response => {
                this.reps = response.json();
                //console.log(this.reps);
        })
    }
}
