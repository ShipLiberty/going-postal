import { Component }         from '@angular/core';
import { SearchComponent  }  from './search/search.component';
import { SelectComponent  }  from './select/select.component';
import { LetterComponent  }  from './letter/letter.component';
import { ShippedComponent }  from './shipped/shipped.component';

@Component({
  selector   : 'main-app',
  templateUrl: 'app/main/main.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                'app/main/main.component.css']
})

export class MainComponent  {
    //just some properties
    reps: Array<any> = [];
    sender = {
        address  : '',
        address2 : '',
        city     : '',
        state    : '',
        zip      : 0
    };

    stages = ['search', 'select', 'letter', 'pay', 'shipped'];

    selectedReps: any = [];

    filledLetters: any = [];

    sentLetters: any = [];

    //for showing the correct component using ngSwitch
    currentView: string;
    currentViewNumber = 0;
    latestViewNumber = 0;

    //called after the constructor and called  after the first ngOnChanges()
    ngOnInit(){
        this.setCurrentView('search');
    }

    nextView() {
        //console.log('in nextView');
        if (this.currentViewNumber >= this.stages.length) {
            console.log('No more views!');
            return;
        }
        this.setCurrentView(this.stages[this.currentViewNumber + 1]);
    }

    //this is used to show the correct component using ngSwitch
    // NOTE: This inits the view as the latest view
    setCurrentView(view) {
        this.currentView = view;
        this.currentViewNumber = this.stages.indexOf(view)
        this.latestViewNumber = this.currentViewNumber;
    }

    // NOTE: This keeps the latest view untouched.  Used in navigation, breadcrumbs, etc
    switchCurrentView(viewNumber) {
        this.currentView = this.stages[viewNumber];
        this.currentViewNumber = viewNumber;
        this.latestViewNumber = Math.max(this.currentViewNumber, this.latestViewNumber);
    }

    //after pressing next on the search component/before seeing the reps that come up
    onSenderChanged(sender) {
      this.sender = sender;
      //console.log('main app sender: '+ this.sender);
    }

    //after getting back data from the search query from backend
    onRepsChanged(reps) {
      this.reps = reps;
      //console.log('main app reps: ' + this.reps);
    }

    //on getting back data from the select component
    onRepsSelected(reps) {
        this.selectedReps = reps;
        //console.log('main app selected reps: ' + this.selectedReps);
    }

    //on getting back data from the filled letters page (going to the pay and review page)
    onLettersFilled(filledLetters) {
        this.filledLetters = filledLetters;
    }

    //once you pay this is the data from the backend of the letters sent
    onLettersPaidAndShipped(lettersSent) {
      this.sentLetters = lettersSent['letters'];
    }
}
