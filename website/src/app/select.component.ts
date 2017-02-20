import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select.component.html',
  styleUrls  : ['semantic/dist/semantic.min.css']
})

export class SelectComponent  {
    @Input() representatives:any;
    
    onRepClick() {
        console.log(this.representatives[0]);
    }
    
}