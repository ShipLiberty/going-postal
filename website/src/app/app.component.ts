import { Component }        from '@angular/core';
import { HeaderComponent }  from './header/header.component';
import { SearchComponent }  from './search/search.component';
import { SelectComponent }  from './select/select.component';
import { LetterComponent }  from './letter/letter.component';
import { FooterComponent }  from './footer/footer.component';

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
    
    selectedRep: any = {};

    //for showing the correct component using ngSwitch
    currentView: string;
    currentViewNumber = 0;
    latestViewNumber = 0;

    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
        this.setCurrentView('search');
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

    //on getting back data from the search component
    onRepsChanged(reps) {
        this.reps = reps;
        //console.log('main app reps: ' + this.reps);
        
        this.setCurrentView('select');
    }
    onSenderChanged(sender) {
        this.sender = sender;
        //console.log('main app sender: '+ this.sender);
    }
    
    //on getting back data from the select component
    onRepSelected(rep) {
        this.selectedRep = rep;
        //console.log('main app selected rep: ' + this.selectedRep);
        
        this.setCurrentView('letter');
    }
}


