import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector   : 'select-rep',
  templateUrl: 'app/select/select.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                'app/select/select.component.css']
})

export class SelectComponent  {
    //just some properties
    @Input() representatives:any; //represnetatives that are shown, input from the search component
    selectedReps: any = [];

    @Output() selectedRepresentatives: EventEmitter<any> = new EventEmitter<any>();
    @Output() next: EventEmitter<any> = new EventEmitter<any>();

    //individual select button statuses
    status0: boolean = false;
    status1: boolean = false;
    status2: boolean = false;

    //individual seleect button text
    selectButtonText0: string = "select";
    selectButtonText1: string = "select";
    selectButtonText2: string = "select";

    //called when a representative is selected
    onRepClick(rep, i) {
      //add or take rep out of array of selected reps
      if (this.selectedReps.indexOf(rep) > -1) {
        this.selectedReps = this.selectedReps.filter(obj => obj !== rep);
      } else {
        this.selectedReps.push(rep);
      }

      //change button style/text
      if (i == 0) {
        this.status0 = !this.status0;
        this.selectButtonText0 = (this.selectButtonText0 == "select") ? "deselect" : "select";
      } else if (i == 1) {
        this.status1 = !this.status1;
        this.selectButtonText1 = (this.selectButtonText1 == "select") ? "deselect" : "select";
      } else if (i == 2) {
        this.status2 = !this.status2;
        this.selectButtonText2 = (this.selectButtonText2 == "select") ? "deselect" : "select";
      }

      //log rep (for debugging)
      //console.log("Reps selcted: " + JSON.stringify(this.selectedReps, null, 4));
    }

    getText(i) {
      if (i == 0) {
        return this.selectButtonText0;
      } else if (i == 1) {
        return this.selectButtonText1;
      } else if (i == 2) {
        return this.selectButtonText2;
      } else {
        //shouldn't hit
        return "select";
      }
    }

    //a helper method to get the class for the select/deselect button in rep cards
    getButtonClasses(i) {
      if (i == 0) {
        if (this.status0 == true) {
          return 'ui green button';
        } else {
          return 'ui basic green button';
        }
      }

      if (i == 1) {
        if (this.status1 == true) {
          return 'ui green button';
        } else {
          return 'ui basic green button';
        }
      }

      if (i == 2) {
        if (this.status2 == true) {
          return 'ui green button';
        } else {
          return 'ui basic green button';
        }
      }
    }

    //called when the next button is clicked
    onNextClick() {
      //notify app component that a rep was selected
      this.selectedRepresentatives.emit(this.selectedReps);
      this.next.emit();
    }

    //a helper method to determine if the next button should be disabled or not
    checkSelectedReps() {
      if (this.selectedReps.length > 0) {
        return false;
      } else {
        return true;
      }
    }
}
