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
    selectedRep: any = {};
    
    //for showing the correct component using ngSwitch
    currentView: string;
    
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
        this.currentView = 'search';
    }
    
    //this is used to show the correct component using ngSwitch
    setCurrentView(view) {
        this.currentView = view;
    }
    
    //on getting back data from the search component
    onRepsChanged(reps) {
        this.reps = reps;
        //console.log('main app reps: ' + this.reps);
        
        this.currentView = 'select';
    }
    onSenderChanged(sender) {
        this.sender = sender;
        //console.log('main app sender: '+ this.sender);
    }
    
    //on getting back data from the select component
    onRepSelected(rep) {
        this.selectedRep = rep;
        //console.log('main app selected rep: ' + this.selectedRep);
        
        this.currentView = 'letter';
    }
}


