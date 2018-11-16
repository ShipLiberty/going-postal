import { Component }         from '@angular/core';
import { HeaderComponent  }  from './header/header.component';
import { SearchComponent  }  from './search/search.component';
import { SelectComponent  }  from './select/select.component';
import { LetterComponent  }  from './letter/letter.component';
import { FooterComponent  }  from './footer/footer.component';
import { MissionComponent } from  './mission/mission.component';
import { LandingFAQComponent } from './landing_faq/landing_faq.component';

@Component({
  selector   : 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                './app/app.component.css']
})

export class AppComponent  {
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

    message = "";

    //for showing the correct component using ngSwitch
    currentView: string;
    currentViewNumber = 0;
    latestViewNumber = 0;

    //called after the constructor and called  after the first ngOnChanges()
    ngOnInit(){
        this.setCurrentView('search');
    }

    nextView() {
        console.log('in nextView');
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

    onMessageChanged(message_and_name) {
        this.sender['name'] = message_and_name['name'];
        this.message = message_and_name['message'];
    }

    //on getting back data from the search component
    onRepsChanged(reps) {
        this.reps = reps;
        //console.log('main app reps: ' + this.reps);
    }
    onSenderChanged(sender) {
        this.sender = sender;
        //console.log('main app sender: '+ this.sender);
    }

    //on getting back data from the select component
    onRepsSelected(reps) {
        this.selectedReps = reps;
        //console.log('main app selected reps: ' + this.selectedReps);
    }
}
