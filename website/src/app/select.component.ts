import { Component, OnInit, Input } from '@angular/core';
import { LetterComponent } from './letter.component';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css']
})

export class SelectComponent  {
    @Input() representatives:any;
    
    //just some properties
    rep: any = 4;
    public repSelected = false;

    /*
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
        //console.log('this sure does work real nice like');
    } */
    
    //called when a representative is checkmarked
    onRepClick(rep) {
        this.rep = rep;
        this.repSelected = true;
    }
}