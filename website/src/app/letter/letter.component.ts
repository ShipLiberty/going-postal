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
    stripeToken  = '';
    
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
           
        //reference to the component context, so that we can call the other functions   
        var componentRef = this; // colloquially "that" or "self"

        //stripe handler
        var handler = (<any>window).StripeCheckout.configure({
            key: this.config.stripeKey,
            locale: 'auto',
            token: function (token: any) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                componentRef.stripeToken = token.id;
                componentRef.postToJesse();
            }
        });
        
        handler.open({
            name: 'Ship Liberty or else',
            description: 'shipping liberty cause thats good',
            amount: 200,
            image: "https://stripe.com/img/documentation/checkout/marketplace.png",
            locale: 'auto'
        });
    }
    
    postToJesse () {
    
        console.log('the striple token is: ' + this.stripeToken);
        //make the body object
        this.body = {'from'   : {'name'    : this.name, 
                                 'address' : this.sender.address, 
                                 'address2': this.sender.address2, 
                                 'city'    : this.sender.city, 
                                 'state'   : this.sender.state, 
                                 'zip'     : +this.sender.zip},
                                 'to'      : this.representative,
                                 'message' : this.message,
                             'stripeToken' : this.stripeToken      
                    };
        
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
        );       
        
    }
}
