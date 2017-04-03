import { Component }        from '@angular/core';
import { SearchComponent }  from './search/search.component';
import { SelectComponent }  from './select/select.component';
import { HeaderComponent }  from './header/header.component';
import { FooterComponent }  from './footer/footer.component';

@Component({
  selector   : 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls  : ['./app/app.component.css',
                './semantic/dist/semantic.min.css']
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
    
    //for showing the correct component using ngSwitch
    currentView: string;
    
    //called after the constructor and called  after the first ngOnChanges() 
    ngOnInit(){
        this.currentView = 'search';
    }
    
    //on getting back data from the search component
    onRepsChanged(reps) {
        this.reps = reps;
        console.log('main app reps: ' + this.reps);
        
        this.currentView = 'select';
    }
    
    onSenderChanged(sender) {
        this.sender = sender;
        console.log('main app sender: '+ this.sender);
    }
    
    //this is used to show the correct component using ngSwitch
    setCurrentView(view) {
        this.currentView = view;
    }
}


