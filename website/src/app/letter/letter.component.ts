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
}
