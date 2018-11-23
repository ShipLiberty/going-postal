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

    @Output() lettersFilled: EventEmitter<any> = new EventEmitter<any>();
    @Output() next: EventEmitter<any> = new EventEmitter<any>();

    filledLetters: any = [];
    hideNextButton = true;

    //form stuff, includes setting the properties and the validation
    //NOTE: defines name and message (used below in post fn)
    form = new FormGroup({
        yourname : new FormControl('', Validators.required),
        message  : new FormControl('', Validators.required),
    });

    visibleTab: number = 0;

    ngAfterViewInit() {
        // Workaround for issue https://github.com/angular/angular/issues/6005
        setTimeout(_=> this.setFormValue());
        setTimeout(_=> this.areLettersWritten(), 500);
        //this doesn't work in there yet...
        const self = this;
        //for the tabs to work
        //ASK JESSE about this and why it works after original start comment
        $('.menu .item').tab({'onVisible':function(argumentOne){
          //this gets called when switching between tabs/representatives
          self.visibleTab = parseInt(argumentOne);
        }});
        //set up the array of letters (dictionaries) to send over
        this.filledLetters = []; //ASK JESSE, not sure why the array is starting with 2 null objects...
        //console.log("array length before: " + this.filledLetters.length);
        for (var i = 0; i < this.selectedReps.length; i++) {
          var dict = {};
          dict.name = "";
          dict.message = "";
          dict.representative = this.selectedReps[i];
          this.filledLetters.push(dict);
        }
        //console.log("letters: " + JSON.stringify(this.filledLetters, null, 4));
    }

    setFormValue() {
        this.form.setValue({'yourname': this.sender['name'] || '',
                            'message': this.message || ''});
    }

    saveLetterAndNext() {
        console.log("this is what is emitted: " + this.filledLetters);
        this.lettersFilled.emit(this.filledLetters);
        this.next.emit();
    }

    letterChange() {
      this.hideNextButton = false;
      for (var i = 0; i < this.filledLetters.length; i++) {
        if (i === this.visibleTab) {
          this.filledLetters[i].message = this.form.value.message;
          this.filledLetters[i].name = this.form.value.yourname;
        }

        //check that all the letters have a name and a message for enabling/disabling next button
        if (this.filledLetters[i].message == "") {
          this.hideNextButton = true;
        }
        if (this.filledLetters[i].name == "") {
          this.hideNextButton = true;
        }
      }
    }

    //helper function to determine if the next button should be enabled/disabled
    areLettersWritten() {
      return this.hideNextButton;
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
