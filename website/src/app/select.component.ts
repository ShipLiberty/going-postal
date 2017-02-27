import { Component, OnInit, Input } from '@angular/core';
import { LetterComponent } from './letter.component';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css']
})

export class SelectComponent  {
    @Input() representatives:any;
    @Input() sender:any;
    
    //just some properties
    rep: any = 4;
    public repSelected = false;

    /*
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
    } */
    
    //called when a representative is checkmarked
    onRepClick(rep) {
        this.rep = rep;
        this.repSelected = true;
        
        /* //to test that we still have the sender info for later.
        console.log('rep checkmarked ---');
        console.log('sender: ' + this.sender);
        console.log('sender addy: ' + this.sender.address);
        console.log('sender city: ' + this.sender.city);
        console.log('sender state: ' + this.sender.state);
        console.log('sender zip: ' + this.sender.zip);
        */
    }
}