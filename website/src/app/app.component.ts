import { Component }         from '@angular/core';
import { HeaderComponent  }  from './header/header.component';
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
    //called after the constructor and called  after the first ngOnChanges()
    ngOnInit(){
    }
}
