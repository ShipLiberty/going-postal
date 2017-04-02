import { Component }        from '@angular/core';
import { SearchComponent }  from './search/search.component';
import { SelectComponent }  from './select/select.component';
import { HeaderComponent }  from './header/header.component';
import { FooterComponent }  from './footer/footer.component';

@Component({
  selector   : 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls  : []
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
    
    //on getting back data from the search component
    onRepsChanged(reps) {
        this.reps = reps;
        console.log('main app reps: ' + this.reps);
    }
    
    onSenderChanged(sender) {
        this.sender = sender;
        console.log('main app sender: '+ this.sender);
    }
}


