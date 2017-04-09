import { trigger, state, style, transition, animate, Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css'],
  animations: [
    trigger('state', [
      state('void', style({ display: 'none' })),
      state('active', style({ display: 'block', transform: 'translate3d(0, 0, 0)' })),
      state('hidden', style({ display: 'none', height: 0, transform: 'translate3d(0, 0, 0)' })),
      transition('active => hidden', [animate('350ms ease-out')]),
      transition('hidden => active', [
        style({ transform: 'translate3d(0, 0, 0)' }),
        animate('350ms ease-in')
      ])
    ])
  ]
})

export class OperatorsComponent implements OnInit {

  public searchOperatorFilter: string;
  public clearSearchResultsStatus: boolean;

  constructor() { this.searchOperatorFilter = ''; this.clearSearchResultsStatus = false; }

  ngOnInit() {
  }

  @Input() nodes;

  toggleSlide(node){
    node.state = (node.state) ? false : true;
    node.iconClass = (node.state) ? 'fa-caret-down' : 'fa-caret-right';
    return node;
  }

  clearSearchResults(){
        this.clearSearchResultsStatus = false;
        this.searchOperatorFilter = '';
    }

    changeSearchResultsStatus(){
        this.clearSearchResultsStatus = (this.searchOperatorFilter.length > 0) ? true:false;
    }

}
