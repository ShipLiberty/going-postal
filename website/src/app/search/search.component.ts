import { ElementRef, Component, OnInit, Inject, Input, Output, EventEmitter, AfterViewInit }   from '@angular/core';
import { FormGroup, FormControl, Validators }                       from '@angular/forms';
import { Http, URLSearchParams }                                    from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig }                                   from './../app.config';


declare var jQuery: any;

@Component({
  selector   : 'search-reps',
  templateUrl: 'app/search/search.component.html',
  styleUrls  : ['app/search/search.component.css',
                './../semantic/dist/semantic.min.css']
})

export class SearchComponent implements AfterViewInit{
    //just some properties
    @Input() reps  : any;
    @Input() sender: any;
    
    @Output() repsChanged  : EventEmitter<any> = new EventEmitter<any>();    
    @Output() senderChanged: EventEmitter<any> = new EventEmitter<any>();    
    @Output() next: EventEmitter<any> = new EventEmitter<any>();    

    isLoading = false;

    //called first time before the ngOnInit()    
    constructor(private http: Http, 
                private elementRef: ElementRef,
                @Inject(APP_CONFIG) private config: IAppConfig) {}
    
    ngAfterViewInit() {
        jQuery(this.elementRef.nativeElement).find('select').dropdown();

        // Workaround for issue https://github.com/angular/angular/issues/6005
        setTimeout(_=> this.setFormValue());
    }
    
    setFormValue() {
        this.form.setValue({'street': this.sender['address'] || '',
                            'city': this.sender['city'] || '',
                            'state': this.sender['state'] || '',
                            'zipcode': this.sender['zip'] || ''});
        jQuery(this.elementRef.nativeElement).find('select').dropdown('set selected', this.form.controls['state'].value);
    }

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
    
        this.isLoading = true;
        //set the sender object details
        this.sender.address = this.form.controls['street'].value;
        this.sender.city    = this.form.controls['city'].value;
        this.sender.state   = this.form.controls['state'].value;
        this.sender.zip     = this.form.controls['zipcode'].value;
        
        //lookup GET request endpoint string buildup
        var address = 'address=' + encodeURIComponent(this.sender.address);
        var city    = '&city='    + encodeURIComponent(this.sender.city);
        var state   = '&state='   + encodeURIComponent(this.sender.state);
        var zip     = '&zip='     + encodeURIComponent(this.sender.zip);

        var getString = this.config.apiEndpoint + 'v1/lookup?' + address + city + state + zip;

        console.log(getString);
        //GET request for the representatives
        this.http.get(getString).subscribe(response => {
                //FIXME: handle errors!
                this.reps = response.json();
                //console.log('reps from the search component:' + this.reps);
                
                //notify app component of changes
                this.repsChanged.emit(this.reps);
                this.senderChanged.emit(this.sender);
                this.next.emit();
        })
    }
    
    /* for later semantic dropdown
                        <div class="four wide field">
                        <label>State</label>
                        <div class="ui selection dropdown" (click)="dropdownClick()">
                            <input type="hidden" 
                                   name="state"
                                   formControlName="state"
                                   id="state1">
                            <i class="dropdown icon"></i>
                            <div class="default text">State</div>
                            <div class="menu">
                                <div class="item" data-value="AL">Alabama</div>
                                <div class="item" data-value="AK">Alaska</div>
                                <div class="item" data-value="AZ">Arizona</div>
                                <div class="item" data-value="AR">Arkansas</div>
                                <div class="item" data-value="CA">California</div>
                                <div class="item" data-value="CO">Colorado</div>
                                <div class="item" data-value="CT">Connecticut</div>
                                <div class="item" data-value="DE">Delaware</div>
                                <div class="item" data-value="DC">District Of Columbia</div>
                                <div class="item" data-value="FL">Florida</div>
                                <div class="item" data-value="GA">Georgia</div>
                                <div class="item" data-value="HI">Hawaii</div>
                                <div class="item" data-value="ID">Idaho</div>
                                <div class="item" data-value="IL">Illinois</div>
                                <div class="item" data-value="IN">Indiana</div>
                                <div class="item" data-value="IA">Iowa</div>
                                <div class="item" data-value="KS">Kansas</div>
                                <div class="item" data-value="KY">Kentucky</div>
                                <div class="item" data-value="LA">Louisiana</div>
                                <div class="item" data-value="ME">Maine</div>
                                <div class="item" data-value="MD">Maryland</div>
                                <div class="item" data-value="MA">Massachusetts</div>
                                <div class="item" data-value="MI">Michigan</div>
                                <div class="item" data-value="MN">Minnesota</div>
                                <div class="item" data-value="MS">Mississippi</div>
                                <div class="item" data-value="MO">Missouri</div>
                                <div class="item" data-value="MT">Montana</div>
                                <div class="item" data-value="NE">Nebraska</div>
                                <div class="item" data-value="NV">Nevada</div>
                                <div class="item" data-value="NH">New Hampshire</div>
                                <div class="item" data-value="NJ">New Jersey</div>
                                <div class="item" data-value="NM">New Mexico</div>
                                <div class="item" data-value="NY">New York</div>
                                <div class="item" data-value="NC">North Carolina</div>
                                <div class="item" data-value="ND">North Dakota</div>
                                <div class="item" data-value="OH">Ohio</div>
                                <div class="item" data-value="OK">Oklahoma</div>
                                <div class="item" data-value="OR">Oregon</div>
                                <div class="item" data-value="PA">Pennsylvania</div>
                                <div class="item" data-value="RI">Rhode Island</div>
                                <div class="item" data-value="SC">South Carolina</div>
                                <div class="item" data-value="SD">South Dakota</div>
                                <div class="item" data-value="TN">Tennessee</div>
                                <div class="item" data-value="TX">Texas</div>
                                <div class="item" data-value="UT">Utah</div>
                                <div class="item" data-value="VT">Vermont</div>
                                <div class="item" data-value="VA">Virginia</div>
                                <div class="item" data-value="WA">Washington</div>
                                <div class="item" data-value="WV">West Virginia</div>
                                <div class="item" data-value="WI">Wisconsin</div>
                                <div class="item" data-value="WY">Wyoming</div>
                            </div>
                        </div>
                    </div>
    */
}
