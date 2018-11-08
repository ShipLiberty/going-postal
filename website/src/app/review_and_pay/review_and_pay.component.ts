import { Component, OnInit, Input, Output, Inject, EventEmitter }   from '@angular/core';
import { Http, Headers, RequestOptions }      from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig }             from './../app.config';

@Component({
  selector   : 'review-and-pay',
  templateUrl: 'app/review_and_pay/review_and_pay.component.html',
  styleUrls  : ['app/review_and_pay/review_and_pay.component.css',
                './../semantic/dist/semantic.min.css']
})

export class ReviewAndPayComponent {

    //some variables
    @Input() representative:any;
    @Input() sender:any;
    @Input() message:string;
    @Output() next: EventEmitter<any> = new EventEmitter<any>();    

    body: any;

    isSubmitting = false;
    isPosting = false;
    //called first time before the ngOnInit() method gets called    
    constructor(private http : Http,
                @Inject(APP_CONFIG) private config: IAppConfig) {}


    openStripeHandler() {
        var p = new Promise((resolve, reject) => {
        
            var isResolved = false;
            //stripe handler
            var handler = (<any>window).StripeCheckout.configure({
                key: this.config.stripeKey,
                locale: 'auto',
                token: function (token: any) {
                    // You can access the token ID with `token.id`.
                    // Get the token ID to your server-side code for use.
                    resolve(token.id);
                    isResolved = true;
                },
                closed: function() {
                    if (!isResolved) {
                        console.log('closed called!');
                        reject(null);
                    }
                }
            });
            
            handler.open({
                name: 'Input credit card details',
                description: 'This covers the cost of printing & shipping',
                amount: 200,
                image: "https://stripe.com/img/documentation/checkout/marketplace.png",
                locale: 'auto'
            });
        });
        return p;
    }

    payAndSubmitLetterAndNext() {
        this.isSubmitting = true;
        this.openStripeHandler()
            .then((tokenId) => {
                this.isPosting = true;
                this.postLetter(tokenId)
                    .then((response) => {
                        this.handleLetterResponseAndNext(response);
                    })
                    .catch((ex) => {
                        this.isSubmitting = false
                        this.isPosting = false;
                     });
            })
            .catch((ex) => {
                this.isSubmitting = false
            });
    }
    
    postLetter(tokenId) {
    
        var p = new Promise((resolve, reject) => {
            console.log('the striple token is: ' + tokenId);
            //make the body object
            this.body = {'from'   : this.sender,
                         'to'      : this.representative,
                         'message' : this.message,
                         'stripeToken' : tokenId
                        };
            
            //console.log('the JSON version of the body is: \n\n' + JSON.stringify(this.body));
            
            //define some headers
            let headers = new Headers({ 'content-type': 'application/json' });
            let options = new RequestOptions({ headers: headers });   
                    
            //POST request to tell Jesse to mail the letter!
            this.http.post(this.config.apiEndpoint + 'v1/letters', JSON.stringify(this.body), options).subscribe(
                response => {
                    console.log('\n\n SUCCESS! =D \n\n');
                    console.log(response.json());
                    resolve(response);
                    }
            );       
        });
        return p;        
    }

    handleLetterResponseAndNext(response) {
        this.next.emit();
    }
}

