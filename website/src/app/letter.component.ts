import { Component, OnInit, Input }           from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions }      from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector   : 'letter-input',
  templateUrl: 'app/letter.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css',
                'app/letter.component.css']
})

export class LetterComponent  {

    //some variables
    ApiBaseUrl = 'https://frozen-refuge-69652.herokuapp.com/v1/letters'; 
    @Input() representative:any;
    @Input() sender:any;
    name     = '';
    message  = '';
    body     : any = {};
    
    //called first time before the ngOnInit() method gets called    
    constructor(
        private http : Http,
    ) {}
    
    //form stuff, includes setting the properties and the validation
    form = new FormGroup({
        name    : new FormControl('', Validators.required),
        message : new FormControl('', Validators.required),
    });
    
    //function called on submit, send letter to Jesse here.
    postLetter() {
        //make the body object
        this.body = {'from'   : {'name'    : this.name, 
                                 'address' : this.sender.address, 
                                 'address2': this.sender.address2, 
                                 'city'    : this.sender.city, 
                                 'state'   : this.sender.state, 
                                 'zip'     : +this.sender.zip},
                     'to'     : this.representative,
                     'message': this.message,};
        
        console.log('the JSON version of the body is: \n\n' + JSON.stringify(this.body));
        console.log('state: ' + this.sender.state);
        
        //define some headers
        //const headers = new Headers ({ 'Content-Type': 'application/json' })        
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        //POST request to tell Jesse to mail the letter!
        this.http.post(this.ApiBaseUrl, JSON.stringify(this.body), options).subscribe(
            response => {
                            console.log('\n\n SUCCESS! =D \n\n');
                            console.log(response.json());
            }
            //err => console.error('This is the error message: ' + err);
        );
    }
}