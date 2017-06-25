import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector   : 'breadcrumbs',
  templateUrl: 'app/breadcrumbs/breadcrumbs.component.html',
  styleUrls  : ['app/breadcrumbs/breadcrumbs.component.css',
                './../semantic/dist/semantic.min.css']
})

export class BreadcrumbsComponent  {

    @Input() activeStage = 0;
    @Input() latestStage = 0;

    @Output() stageClicked: EventEmitter<any> = new EventEmitter<any>();    

    public breadcrumbClicked(stage) {
        this.stageClicked.emit(stage)
    }
}
