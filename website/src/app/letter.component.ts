import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector   : 'letter-input',
  templateUrl: 'app/letter.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css', 'app/letter.component.css']
})

export class LetterComponent  {

    @Input() representative:any;

    /*
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
        //console.log('this sure does work real nice like');
    } */
}