import { Component, OnInit, Inject, Input }   from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, URLSearchParams }              from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig }             from './../app.config';

@Component({
  selector   : 'search-reps',
  templateUrl: 'app/search/search.component.html',
  styleUrls  : ['app/search/search.component.css']
})

export class SearchComponent  {
    //just some properties
    @Input() reps  : any;
    @Input() sender: any;
    
    //called first time before the ngOnInit()    
    constructor(private http: Http, 
                @Inject(APP_CONFIG) private config: IAppConfig) {}
    
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
        var address = 'address=' + this.sender.address;
        var city    = '&city='    + this.sender.city;
        var state   = '&state='   + this.sender.state;
        var zip     = '&zip='     + this.sender.zip;
    
        var getString = this.config.apiEndpoint + 'v1/lookup?' + address + city + state + zip;
    
        console.log(getString);
        //GET request for the representatives
        this.http.get(getString).subscribe(response => {
                this.reps = response.json();
                console.log(this.reps);
        })
    }
}
