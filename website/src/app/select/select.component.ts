import { Component, OnInit, Input } from '@angular/core';
import { LetterComponent } from './../letter/letter.component';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select/select.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                'app/select/select.component.css']
})

export class SelectComponent  {
    //just some properties
    @Input() representatives:any;
    @Input() sender:any;
    
    rep: any = {};
    public repSelected = false;
    
    //called when a representative is selected
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
