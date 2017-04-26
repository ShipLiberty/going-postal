import { Component, OnInit, Input, Inject }           from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions }      from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig }             from './../app.config';

@Component({
  selector   : 'letter-input',
  templateUrl: 'app/letter/letter.component.html',
  styleUrls  : ['app/letter/letter.component.css',
                './../semantic/dist/semantic.min.css']
})

export class LetterComponent  {

    //some variables
    @Input() representative:any;
    @Input() sender:any;
    name     = '';
    message  = '';
    body     : any = {};
    
    //called first time before the ngOnInit() method gets called    
    constructor(private http : Http,
                @Inject(APP_CONFIG) private config: IAppConfig) {}
    
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
                     'message': this.message};
        
        console.log('the JSON version of the body is: \n\n' + JSON.stringify(this.body));
        
        //define some headers
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        //POST request to tell Jesse to mail the letter!
        this.http.post(this.config.apiEndpoint + 'v1/letters', JSON.stringify(this.body), options).subscribe(
            response => {
                            console.log('\n\n SUCCESS! =D \n\n');
                            console.log(response.json());
            }
            //err => console.error('This is the error message: ' + err);
        );
    }
}