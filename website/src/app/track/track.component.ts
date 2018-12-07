import { Component }         from '@angular/core';

@Component({
  selector   : 'track-page',
  templateUrl: 'app/track/track.component.html',
  styleUrls  : ['./semantic/dist/semantic.min.css',
                'app/track/track.component.css']
})

export class TrackComponent  {

    //called after the constructor and called  after the first ngOnChanges()
    ngOnInit(){
    }
}
