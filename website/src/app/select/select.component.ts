import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select/select.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                'app/select/select.component.css']
})

export class SelectComponent  {
    //just some properties
    @Input() representatives:any;
    
    @Output() next: EventEmitter<any> = new EventEmitter<any>();
    @Output() repSelected  : EventEmitter<any> = new EventEmitter<any>();
        
    //called when a representative is selected
    onRepClick(rep) {
        //notify app component that a rep was selected
        this.repSelected.emit(rep);
        this.next.emit();
        
        //log rep (for debugging)
        console.log(JSON.stringify(rep, null, 4));
    }
}
