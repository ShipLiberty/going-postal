import { Component, OnInit, Input, Output, Inject, EventEmitter, AfterViewInit }   from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';

@Component({
  selector   : 'letter-input',
  templateUrl: 'app/letter/letter.component.html',
  styleUrls  : ['app/letter/letter.component.css',
                './../semantic/dist/semantic.min.css']
})

export class LetterComponent implements AfterViewInit {

    //some variables
    @Input()  selectedReps:any;
    @Input()  sender:any;
    @Input()  message:any;

    @Output() messageChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() next: EventEmitter<any> = new EventEmitter<any>();

    //form stuff, includes setting the properties and the validation
    //NOTE: defines name and message (used below in post fn)
    form = new FormGroup({
        yourname : new FormControl('', Validators.required),
        message  : new FormControl('', Validators.required),
    });

    ngAfterViewInit() {
        // Workaround for issue https://github.com/angular/angular/issues/6005
        setTimeout(_=> this.setFormValue());
        $('.menu .item').tab({'onVisible':function(){
          //this gets called when switching between tabs/representatives
        }});
    }

    setFormValue() {
        this.form.setValue({'yourname': this.sender['name'] || '',
                            'message': this.message || ''});
    }

    saveLetterAndNext() {
        var message_and_name = {'name'    : this.form.value.yourname,
                                'message' : this.form.value.message};
        this.messageChanged.emit(message_and_name);
        this.next.emit();
    }

    //helper function to determine tab header class -- just makes first tab active on load
    getTabHeaderClass(index) {
      if (index == 0) {
        return "item active";
      } else {
        return "item";
      }
    }
    //helper function to determine tab sections class -- just makes first section active on load
    getTabBottomClass(index) {
      if (index == 0) {
        return "ui bottom attached tab segment active";
      } else {
        return "ui bottom attached tab segment";
      }
    }
}
