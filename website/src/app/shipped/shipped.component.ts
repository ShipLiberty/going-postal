import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector   : 'shipped-congrats',
  templateUrl: 'app/shipped/shipped.component.html',
  styleUrls  : ['app/shipped/shipped.component.css',
                './semantic/dist/semantic.min.css']
})

export class ShippedComponent  {

  @Input()  sentLetters:any;

  ngAfterViewInit() {
    console.log('shipped: ' + JSON.stringify(this.sentLetters, null, 4));
  }

}
