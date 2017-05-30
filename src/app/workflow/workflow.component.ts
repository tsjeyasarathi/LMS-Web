import { trigger, state, style, transition, animate, Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Node }  from './node';
import { FlowchartComponent } from './../shared/components/flowchart/flowchart.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from  '../shared/services/auth.service';

@Component({
  selector: 'app-workflow',
  templateUrl: 'workflow.component.html',
  styleUrls: ['workflow.component.css'],
  providers: [FlowchartComponent],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(0)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(0)'}))
      ])
    ]),
    trigger('toggleAlertPanel', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.1s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 10 ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])

    ])
  ]
})
export class WorkflowComponent implements OnInit {

  project = {};
  operators:Array<Node> = [];
  flowControlNodes:Array<Node> = [];
  state:boolean;
  operatorsPanelShown:boolean;
  selectedProjectId:any;
  connections = {};
  modalSize:string;
  workflowRunName:string;
  workflowRunNameError:boolean;
  errorMessage:string;
  userDetails:any;
  alertData = [];
  workflowRuns = [];
  selectedFolder:any;
  selectedFile:any;
  availableFileNodes:any;
  currentNode:any;
  exportCSVForm:any;
  conn:any;
  operatorConfig = {};
  isAnyColumnsAdded:boolean;
  outputOptions:any;
  selectedOutputOptions:string;
  inputCol:boolean;
  outputCol:boolean;
  modalError:string;
  selectedInputOptions:any;

  columns:any[];
  private selectedOptions:number[];
  schemaList = [];
  addedColumnsFlag = [];
  newColumns = [];
  public dataset:any;
  public columnSchemaCloned:any;
  public config:any;
  tech:string;
  level:number;
  step:number;
  section:string;
  public created_ts;

  @ViewChild('defaultModal') defaultModal:TemplateRef<any>;
  @ViewChild('loadDatasetModal') loadDatasetModal:TemplateRef<any>;
  @ViewChild('outputCSVModal') outputCSVModal:TemplateRef<any>;
  @ViewChild('decisionTreeModal') decisionTreeModal:TemplateRef<any>;
  @ViewChild('addColumnModal') addColumnModal:TemplateRef<any>;
  @ViewChild('joinDatasetModal') joinDatasetModal:TemplateRef<any>;
  @ViewChild('quickSummaryModal') quickSummaryModal:TemplateRef<any>;
  @ViewChild('clearWorkflowModal') clearWorkflowModal:TemplateRef<any>;
  @ViewChild('inputWorkflowRunMetadata') inputWorkflowRunMetadata:TemplateRef<any>;
  @ViewChild('inputWorkflowMetadata') inputWorkflowMetadata:TemplateRef<any>;
  @ViewChild('confirmConnectionDeleteModal') confirmConnectionDeleteModal:TemplateRef<any>;
  @ViewChild('containerElem') containerElem:ElementRef;

  constructor(private route:ActivatedRoute, public router:Router,
              public flowChart:FlowchartComponent,
              public renderer:Renderer, private http:Http, public authService:AuthService) {
    this.modalSize = 'default-lg';
    this.workflowRunName = '';
    this.workflowRunNameError = false;
    this.operatorsPanelShown = true;
    this.dataset = null;
    this.selectedOutputOptions = '';
    this.modalError = '';
    this.selectedOptions = [];
    this.section = 'courseFlow';
    this.step = 0;
    this.flowControlNodes = [];

    this.columns = [{"name": "column1"}, {"name": "column2"}, {"name": "column3"}, {"name": "column4"}, {"name": "column5"}, {"name": "column6"}, {"name": "column7"}, {"name": "column8"}];

    for (let i in this.operators) {
      let childOperators = this.operators[i]['children'];
      for (let j in childOperators) {
        if (childOperators[j]['name'] == 'Hello World') {
          this.operatorConfig['helloWorld'] = childOperators[j]['id'];
          continue;
        }
        if (childOperators[j]['name'] == 'Load Dataset') {
          this.operatorConfig['loadDataset'] = childOperators[j]['id'];
          continue;
        }
        if (childOperators[j]['name'] == 'Export CSV') {
          this.operatorConfig['exportCSV'] = childOperators[j]['id'];
          continue;
        }
        if (childOperators[j]['name'] == 'Decision Tree') {
          this.operatorConfig['decisionTree'] = childOperators[j]['id'];
          continue;
        }
        if (childOperators[j]['name'] == 'Add Column') {
          this.operatorConfig['addColumn'] = childOperators[j]['id'];
          continue;
        }
      }
    }

    this.flowChart.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    this.route.params.forEach((params:Params) => {
      this.level = parseInt(params['level']);
      this.tech = params['name'];

      this.step = 1;

      let data = this.loadContent();
      this.clearWorkflow();
      this.initWorkflow(data);

    });

    var resp;
    var user_id = this.authService.getId();
    this.http.get('http://localhost:4040/user/levelupd/' + user_id + '/' + this.tech + '/' + this.level)
      .subscribe((res) => {
        resp = JSON.parse(res["_body"]);
        this.created_ts = resp['created_at'];
      });

  }

  ngOnInit() {

  }

  goToNextLevel() {
    this.router.navigate(['/tech', this.tech, this.level + 1]);
  }

  loadContent() {

    let data = {}
    if (this.level == 1 && this.tech == 'SQL') {

      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",
            "duration": null
          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278531966",
            "operator_id": 1,
            "name": "Introduction to SQL",
            "type": "",
            "class": "fa fa-book",
            "duration": "1 hour"
          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278531967",
            "operator_id": 1,
            "name": "Understand syntaxing a query",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 hours"
          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_1476278531968",
            "operator_id": 1,
            "name": "Practice your queries",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "305", "yloc": "215"},
            "id": "task_1476278531969",
            "operator_id": 1,
            "name": "Know more about RDBMS",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "40 hours"
          },
          {
            "metadata": {"xloc": "427", "yloc": "286"},
            "id": "task_1476278531970",
            "operator_id": 1,
            "name": "Practice your RDBMS concepts",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "555", "yloc": "333", "color": "#52BE80"},
            "id": "task_1476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401202",
            "relation": "",
            "target": "task_1476278531966"
          },
          {
            "source": "task_1476278531966",
            "relation": "",
            "target": "task_1476278531967"
          },
          {
            "source": "task_1476278531967",
            "relation": "",
            "target": "task_1476278531968"
          },
          {
            "source": "task_1476278531968",
            "relation": "",
            "target": "task_1476278531969"
          },
          {
            "source": "task_1476278531969",
            "relation": "",
            "target": "task_1476278531970"
          },
          {
            "source": "task_1476278531970",
            "relation": "",
            "target": "task_1476278531971"
          }
        ]
      };
    } else if (this.level == 2 && this.tech == 'SQL') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278404202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",
            "duration": null
          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278551966",
            "operator_id": 1,
            "name": "Basic Operations & Aggregating Data",
            "type": "",
            "class": "fa fa-book",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278571967",
            "operator_id": 1,
            "name": "Joins",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 hours"
          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_1476278581968",
            "operator_id": 1,
            "name": "Subqueries",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "305", "yloc": "215"},
            "id": "task_1476278561969",
            "operator_id": 1,
            "name": "Practice Exercises",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 hours"
          },
          {
            "metadata": {"xloc": "427", "yloc": "286"},
            "id": "task_1476288761969",
            "operator_id": 1,
            "name": "SQL Quiz",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "1 hours"
          },
          {
            "metadata": {"xloc": "555", "yloc": "333", "color": "#52BE80"},
            "id": "task_1476278581971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278404202",
            "relation": "",
            "target": "task_1476278551966"

          },
          {
            "source": "task_1476278551966",
            "relation": "",
            "target": "task_1476278571967"
          },
          {
            "source": "task_1476278571967",
            "relation": "",
            "target": "task_1476278581968"
          },
          {
            "source": "task_1476278581968",
            "relation": "",
            "target": "task_1476278561969"
          },
          {
            "source": "task_1476278561969",
            "relation": "",
            "target": "task_1476288761969"
          },
          {
            "source": "task_1476288761969",
            "relation": "",
            "target": "task_1476278581971"
          }
        ]
      }
    } else if (this.level == 3 && this.tech == 'SQL') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401203",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",
            "duration": null
          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278531966",
            "operator_id": 1,
            "name": "Advanced",
            "type": "",
            "class": "fa fa-book",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278531967",
            "operator_id": 1,
            "name": "Learn to connect Python to a database",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 weeks"
          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_1476278531968",
            "operator_id": 1,
            "name": "Learn to use analytical elements of SQL for answering BI questions",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "42 hours"
          },
          {
            "metadata": {"xloc": "305", "yloc": "215"},
            "id": "task_1476278531969",
            "operator_id": 1,
            "name": "Ebook with video illustrations",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "427", "yloc": "286"},
            "id": "task_1476278531970",
            "operator_id": 1,
            "name": "SQL puzzles and answers",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "555", "yloc": "333", "color": "#52BE80"},
            "id": "task_1476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401203",
            "relation": "",
            "target": "task_1476278531966"
          },
          {
            "source": "task_1476278531966",
            "relation": "",
            "target": "task_1476278531967"
          },
          {
            "source": "task_1476278531967",
            "relation": "",
            "target": "task_1476278531968"
          },
          {
            "source": "task_1476278531968",
            "relation": "",
            "target": "task_1476278531969"
          },
          {
            "source": "task_1476278531969",
            "relation": "",
            "target": "task_1476278531970"
          },
          {
            "source": "task_1476278531970",
            "relation": "",
            "target": "task_1476278531971"
          }
        ]
      }
    }
    else if (this.level == 1 && this.tech == 'Python') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401303",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278532966",
            "operator_id": 1,
            "name": "How to Think like a computer scientist",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278532967",
            "operator_id": 1,
            "name": "Stackoverflow question",
            "type": "",
            "class": "fa fa-video-camera",
          },
          {
            "metadata": {"xloc": "194", "yloc": "150"},
            "id": "task_1476278532968",
            "operator_id": 1,
            "name": "Hands-on Python Tutorial",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "305", "yloc": "210"},
            "id": "task_1476278532969",
            "operator_id": 1,
            "name": "How to Think like a computer scientist",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "407", "yloc": "270"},
            "id": "task_1476278532970",
            "operator_id": 1,
            "name": "Hands-on Python Tutorial",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "505", "yloc": "330"},
            "id": "task_1476278532971",
            "operator_id": 1,
            "name": "How to Think like a computer scientist-Tuples",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "610", "yloc": "390"},
            "id": "task_1476278532972",
            "operator_id": 1,
            "name": "How to Think like a computer scientist-Lists",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "710", "yloc": "450"},
            "id": "task_1476278532973",
            "operator_id": 1,
            "name": "set-python",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "820", "yloc": "510"},
            "id": "task_1476278532974",
            "operator_id": 1,
            "name": "dictionary-python",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "860", "yloc": "530"},
            "id": "task_1476278532975",
            "operator_id": 1,
            "name": "Python List comprehensions: Explained visually",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "919", "yloc": "570", "color": "#52BE80"},
            "id": "task_1476278532976",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401303",
            "relation": "",
            "target": "task_1476278532966"
          },
          {
            "source": "task_1476278532966",
            "relation": "",
            "target": "task_1476278532967"
          },
          {
            "source": "task_1476278532967",
            "relation": "",
            "target": "task_1476278532968"
          },
          {
            "source": "task_1476278532968",
            "relation": "",
            "target": "task_1476278532969"
          },
          {
            "source": "task_1476278532969",
            "relation": "",
            "target": "task_1476278532970"
          },
          {
            "source": "task_1476278532970",
            "relation": "",
            "target": "task_1476278532971"
          }
          ,
          {
            "source": "task_1476278532971",
            "relation": "",
            "target": "task_1476278532972"
          }
          ,
          {
            "source": "task_1476278532972",
            "relation": "",
            "target": "task_1476278532973"
          }
          ,
          {
            "source": "task_1476278532973",
            "relation": "",
            "target": "task_1476278532974"
          }
          ,
          {
            "source": "task_1476278532974",
            "relation": "",
            "target": "task_1476278532975"
          },
          {
            "source": "task_1476278532975",
            "relation": "",
            "target": "task_1476278532976"
          }
        ]
      }
    } else if (this.level == 2 && this.tech == 'Python') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401403",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "71", "yloc": "99"},
            "id": "task_1476278533966",
            "operator_id": 1,
            "name": "Python for beginners",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "190", "yloc": "148"},
            "id": "task_1476278533967",
            "operator_id": 1,
            "name": "Python course",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "305", "yloc": "225"},
            "id": "task_1476278533968",
            "operator_id": 1,
            "name": "PyMotw",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "407", "yloc": "286"},
            "id": "task_1476278533969",
            "operator_id": 1,
            "name": "SQL Introduction for Python Programmers",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "515", "yloc": "347"},
            "id": "task_1476278533970",
            "operator_id": 1,
            "name": "Python Functions - Map, Filter, and reduce",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "600", "yloc": "400"},
            "id": "task_1476278533971",
            "operator_id": 1,
            "name": "Python Wiki",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "699", "yloc": "463", "color": "#52BE80"},
            "id": "task_1476278533972",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401403",
            "relation": "",
            "target": "task_1476278533966"
          },
          {
            "source": "task_1476278533966",
            "relation": "",
            "target": "task_1476278533967"
          },
          {
            "source": "task_1476278533967",
            "relation": "",
            "target": "task_1476278533968"
          },
          {
            "source": "task_1476278533968",
            "relation": "",
            "target": "task_1476278533969"
          },
          {
            "source": "task_1476278533969",
            "relation": "",
            "target": "task_1476278533970"
          },
          {
            "source": "task_1476278533970",
            "relation": "",
            "target": "task_1476278533971"
          }
          ,
          {
            "source": "task_1476278533971",
            "relation": "",
            "target": "task_1476278533972"
          }


        ]
      }
    }
    else if (this.level == 3 && this.tech == 'Python') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401503",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278535966",
            "operator_id": 1,
            "name": "Everything I know about Python",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278535967",
            "operator_id": 1,
            "name": "How to Think like a computer scientist",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_1476278535968",
            "operator_id": 1,
            "name": "Python Course",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "305", "yloc": "215"},
            "id": "task_1476278535969",
            "operator_id": 1,
            "name": "Scikit learn tutorial",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "427", "yloc": "286"},
            "id": "task_1476278535970",
            "operator_id": 1,
            "name": "Pandas Cookbook",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "525", "yloc": "353"},
            "id": "task_1476278535971",
            "operator_id": 1,
            "name": "Practical Machine Learning Tutorial with Python Introduction",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "620", "yloc": "420"},
            "id": "task_1476278535972",
            "operator_id": 1,
            "name": "Tutorial: Machine Learning with Text in scikit-learn",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "705", "yloc": "483"},
            "id": "task_1476278535973",
            "operator_id": 1,
            "name": "Bokeh: Ineractive data visualizations with Python",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "800", "yloc": "520"},
            "id": "task_1476278535974",
            "operator_id": 1,
            "name": "Python Web Scraping Tutorial using BeautifulSoup",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "900", "yloc": "583"},
            "id": "task_1476278535975",
            "operator_id": 1,
            "name": "Selenium with Python",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "999", "yloc": "640"},
            "id": "task_1476278535976",
            "operator_id": 1,
            "name": "Scrapy Tutorial",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "1100", "yloc": "700", "color": "#52BE80"},
            "id": "task_1476278535977",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401503",
            "relation": "",
            "target": "task_1476278535966"
          },
          {
            "source": "task_1476278535966",
            "relation": "",
            "target": "task_1476278535967"
          },
          {
            "source": "task_1476278535967",
            "relation": "",
            "target": "task_1476278535968"
          },
          {
            "source": "task_1476278535968",
            "relation": "",
            "target": "task_1476278535969"
          },
          {
            "source": "task_1476278535969",
            "relation": "",
            "target": "task_1476278535970"
          },
          {
            "source": "task_1476278535970",
            "relation": "",
            "target": "task_1476278535971"
          }
          ,
          {
            "source": "task_1476278535971",
            "relation": "",
            "target": "task_1476278535972"
          }
          ,
          {
            "source": "task_1476278535972",
            "relation": "",
            "target": "task_1476278535973"
          }
          ,
          {
            "source": "task_1476278535973",
            "relation": "",
            "target": "task_1476278535974"
          }
          ,
          {
            "source": "task_1476278535974",
            "relation": "",
            "target": "task_1476278535975"
          },
          {
            "source": "task_1476278535975",
            "relation": "",
            "target": "task_1476278535976"
          },
          {
            "source": "task_1476278535976",
            "relation": "",
            "target": "task_1476278535977"
          }
        ]
      }
    }
    else if (this.level == 1 && this.tech == 'Tableau') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401603",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278536966",
            "operator_id": 1,
            "name": "Introduction to Tableau",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278536967",
            "operator_id": 1,
            "name": "To get familiar with Tableau application",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "184", "yloc": "160"},
            "id": "task_1476278536968",
            "operator_id": 1,
            "name": "Simple data manipulations",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "284", "yloc": "240"},
            "id": "task_1476278536969",
            "operator_id": 1,
            "name": "Basic Charts",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "382", "yloc": "320"},
            "id": "task_1476278536970",
            "operator_id": 1,
            "name": "Creating basic charts - try to replicate charts with only one metric",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "482", "yloc": "380"},
            "id": "task_1476278536971",
            "operator_id": 1,
            "name": "Calculated Field",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "582", "yloc": "440"},
            "id": "task_1476278536972",
            "operator_id": 1,
            "name": "Calculations",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "682", "yloc": "500"},
            "id": "task_1476278536973",
            "operator_id": 1,
            "name": "Creating Dashboards",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "782", "yloc": "560"},
            "id": "task_1476278536974",
            "operator_id": 1,
            "name": "Exercise to create dashboards ",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "882", "yloc": "620"},
            "id": "task_1476278536975",
            "operator_id": 1,
            "name": "Additional Tips and tricks",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "982", "yloc": "680", "color": "#52BE80"},
            "id": "task_1476278536976",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401603",
            "relation": "",
            "target": "task_1476278536966"
          },
          {
            "source": "task_1476278536966",
            "relation": "",
            "target": "task_1476278536967"
          },
          {
            "source": "task_1476278536967",
            "relation": "",
            "target": "task_1476278536968"
          },
          {
            "source": "task_1476278536968",
            "relation": "",
            "target": "task_1476278536969"
          },
          {
            "source": "task_1476278536969",
            "relation": "",
            "target": "task_1476278536970"
          },
          {
            "source": "task_1476278536970",
            "relation": "",
            "target": "task_1476278536971"
          }
          ,
          {
            "source": "task_1476278536971",
            "relation": "",
            "target": "task_1476278536972"
          }
          ,
          {
            "source": "task_1476278536972",
            "relation": "",
            "target": "task_1476278536973"
          }
          ,
          {
            "source": "task_1476278536973",
            "relation": "",
            "target": "task_1476278536974"
          }
          ,
          {
            "source": "task_1476278536974",
            "relation": "",
            "target": "task_1476278536975"
          },
          {
            "source": "task_1476278536975",
            "relation": "",
            "target": "task_1476278536976"
          }
        ]
      }
    }
    else if (this.level == 2 && this.tech == 'Tableau') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401703",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",
            "duration": null
          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278537966",
            "operator_id": 1,
            "name": "Quizzes to begin with !",
            "type": "",
            "class": "fa fa-book",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278537967",
            "operator_id": 1,
            "name": "Parameters",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 weeks"
          },
          {
            "metadata": {"xloc": "184", "yloc": "160"},
            "id": "task_1476278537968",
            "operator_id": 1,
            "name": "Adding dynamic selection to the charts created in previous level",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "42 hours"
          },
          {
            "metadata": {"xloc": "284", "yloc": "220"},
            "id": "task_1476278537969",
            "operator_id": 1,
            "name": "Grouping and Hierarchy",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "384", "yloc": "286"},
            "id": "task_1476278537970",
            "operator_id": 1,
            "name": "Dual Axis",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "484", "yloc": "340"},
            "id": "task_1476278537971",
            "operator_id": 1,
            "name": "Using Measure Values in Axis",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "584", "yloc": "400"},
            "id": "task_1476278537972",
            "operator_id": 1,
            "name": "Story",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "684", "yloc": "460"},
            "id": "task_1476278537973",
            "operator_id": 1,
            "name": "Exercise to create story in Tableau",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "784", "yloc": "520"},
            "id": "task_1476278537974",
            "operator_id": 1,
            "name": "Action Filters ",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "883", "yloc": "580"},
            "id": "task_1476278537975",
            "operator_id": 1,
            "name": "Exercise for Action filters ",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "983", "yloc": "640"},
            "id": "task_1476278537976",
            "operator_id": 1,
            "name": "Replacing Datasource",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "1033", "yloc": "700"},
            "id": "task_1476278537977",
            "operator_id": 1,
            "name": "BookMarks in Tableau ",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "1130", "yloc": "760", "color": "#52BE80"},
            "id": "task_1476278537978",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401703",
            "relation": "",
            "target": "task_1476278537966"
          },
          {
            "source": "task_1476278537966",
            "relation": "",
            "target": "task_1476278537967"
          },
          {
            "source": "task_1476278537967",
            "relation": "",
            "target": "task_1476278537968"
          },
          {
            "source": "task_1476278537968",
            "relation": "",
            "target": "task_1476278537969"
          },
          {
            "source": "task_1476278537969",
            "relation": "",
            "target": "task_1476278537970"
          },
          {
            "source": "task_1476278537970",
            "relation": "",
            "target": "task_1476278537971"
          }
          ,
          {
            "source": "task_1476278537971",
            "relation": "",
            "target": "task_1476278537972"
          }
          ,
          {
            "source": "task_1476278537972",
            "relation": "",
            "target": "task_1476278537973"
          }
          ,
          {
            "source": "task_1476278537973",
            "relation": "",
            "target": "task_1476278537974"
          }
          ,
          {
            "source": "task_1476278537974",
            "relation": "",
            "target": "task_1476278537975"
          },
          {
            "source": "task_1476278537975",
            "relation": "",
            "target": "task_1476278537976"
          },
          {
            "source": "task_1476278537976",
            "relation": "",
            "target": "task_1476278537977"
          },
          {
            "source": "task_1476278537977",
            "relation": "",
            "target": "task_1476278537978"
          }
        ]
      }
    }
    else if (this.level == 3 && this.tech == 'Tableau') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_1476278401803",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",
            "duration": null
          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_1476278538966",
            "operator_id": 1,
            "name": "More charts and Applications",
            "type": "",
            "class": "fa fa-book",
            "duration": "3 hours"
          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_1476278538967",
            "operator_id": 1,
            "name": "Mapping and Geo Coding",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": "4 weeks"
          },
          {
            "metadata": {"xloc": "180", "yloc": "158"},
            "id": "task_1476278538968",
            "operator_id": 1,
            "name": "Forecasting",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": "42 hours"
          },
          {
            "metadata": {"xloc": "280", "yloc": "220"},
            "id": "task_1476278538969",
            "operator_id": 1,
            "name": "Quiz on Forecasting ",
            "type": "",
            "class": "fa fa-video-camera",
            "duration": ""
          },
          {
            "metadata": {"xloc": "380", "yloc": "280"},
            "id": "task_1476278538970",
            "operator_id": 1,
            "name": "Data Blending",
            "type": "",
            "class": "fa fa-newspaper-o",
            "duration": ""
          },
          {
            "metadata": {"xloc": "480", "yloc": "320"},
            "id": "task_1476278538971",
            "operator_id": 1,
            "name": "Quiz on Blending ",
            "type": "",
            "class": "fa fa-newspaper-o",

          }
          ,
          {
            "metadata": {"xloc": "580", "yloc": "380"},
            "id": "task_1476278538972",
            "operator_id": 1,
            "name": "Using Images in Tableau",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "680", "yloc": "440"},
            "id": "task_1476278538973",
            "operator_id": 1,
            "name": "Good reads ",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "780", "yloc": "500", "color": "#52BE80"},
            "id": "task_1476278538974",
            "operator_id": 1,
            "name": "Congratulations",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_1476278401803",
            "relation": "",
            "target": "task_1476278538966"
          },
          {
            "source": "task_1476278538966",
            "relation": "",
            "target": "task_1476278538967"
          },
          {
            "source": "task_1476278538967",
            "relation": "",
            "target": "task_1476278538968"
          },
          {
            "source": "task_1476278538968",
            "relation": "",
            "target": "task_1476278538969"
          },
          {
            "source": "task_1476278538969",
            "relation": "",
            "target": "task_1476278538970"
          },
          {
            "source": "task_1476278538970",
            "relation": "",
            "target": "task_1476278538971"
          }
          ,
          {
            "source": "task_1476278538971",
            "relation": "",
            "target": "task_1476278538972"
          }
          ,
          {
            "source": "task_1476278538972",
            "relation": "",
            "target": "task_1476278538973"
          }
          ,
          {
            "source": "task_1476278538973",
            "relation": "",
            "target": "task_1476278538974"
          }

        ]
      }
    }
    else if (this.level == 1 && this.tech == 'Excel') {

      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_2476278401202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play"


          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_2476278531966",
            "operator_id": 1,
            "name": "Introduction to excel",
            "type": "",
            "class": "fa fa-book"

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_2476278531967",
            "operator_id": 1,
            "name": "Microsoft Excel 2010",
            "type": "",
            "class": "fa fa-video-camera"
          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_2476278531968",
            "operator_id": 1,
            "name": "Basic Excel Skills",
            "type": "",
            "class": "fa fa-newspaper-o"
          },
          {
            "metadata": {"xloc": "305", "yloc": "215"},
            "id": "task_2476278531969",
            "operator_id": 1,
            "name": "Beginners/Intermediate Excel training",
            "type": "",
            "class": "fa fa-video-camera"
          },

          {
            "metadata": {"xloc": "410", "yloc": "270", "color": "#52BE80"},
            "id": "task_2476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o"

          }
        ],
        "connections": [
          {
            "source": "task_2476278401202",
            "relation": "",
            "target": "task_2476278531966"
          },
          {
            "source": "task_2476278531966",
            "relation": "",
            "target": "task_2476278531967"
          },
          {
            "source": "task_2476278531967",
            "relation": "",
            "target": "task_2476278531968"
          },
          {
            "source": "task_2476278531968",
            "relation": "",
            "target": "task_2476278531969"
          },
          {
            "source": "task_2476278531969",
            "relation": "",
            "target": "task_2476278531971"
          }
        ]
      }
    }
    else if (this.level == 2 && this.tech == 'Excel') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_3476278404202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_3476278551966",
            "operator_id": 1,
            "name": "Basic Operations",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_3476278571967",
            "operator_id": 1,
            "name": "Basic Operations",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_3476278581968",
            "operator_id": 1,
            "name": "Practice Exercises",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "305", "yloc": "218"},
            "id": "task_3476288761969",
            "operator_id": 1,
            "name": "Advanced Operations",
            "type": "",
            "class": "fa fa-video-camera",

          },

          {
            "metadata": {"xloc": "405", "yloc": "273", "color": "#52BE80"},
            "id": "task_3476278581971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_3476278404202",
            "relation": "",
            "target": "task_3476278551966"

          },
          {
            "source": "task_3476278551966",
            "relation": "",
            "target": "task_3476278571967"
          },
          {
            "source": "task_3476278571967",
            "relation": "",
            "target": "task_3476278581968"
          },
          {
            "source": "task_3476278581968",
            "relation": "",
            "target": "task_3476288761969"
          },

          {
            "source": "task_3476288761969",
            "relation": "",
            "target": "task_3476278581971"
          }
        ]
      }
    }
    else if (this.level == 3 && this.tech == 'Excel') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_4476278401203",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_4476278531966",
            "operator_id": 1,
            "name": "Expert",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_4476278531967",
            "operator_id": 1,
            "name": "Expert",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_4476278531968",
            "operator_id": 1,
            "name": "Practice Exercises",
            "type": "",
            "class": "fa fa-newspaper-o",

          },

          {
            "metadata": {"xloc": "305", "yloc": "218", "color": "#52BE80"},
            "id": "task_4476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_4476278401203",
            "relation": "",
            "target": "task_4476278531966"
          },
          {
            "source": "task_4476278531966",
            "relation": "",
            "target": "task_4476278531967"
          },
          {
            "source": "task_4476278531967",
            "relation": "",
            "target": "task_4476278531968"
          },
          {
            "source": "task_4476278531968",
            "relation": "",
            "target": "task_4476278531971"
          }
        ]
      }
    }

    else if (this.level == 1 && this.tech == 'Visualization') {

      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_5476278401202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play"


          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_5476278531966",
            "operator_id": 1,
            "name": "Essentials of PowerPoint",
            "type": "",
            "class": "fa fa-book"

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_5476278531967",
            "operator_id": 1,
            "name": "Better Data Visualization for Organizations",
            "type": "",
            "class": "fa fa-video-camera"
          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_5476278531968",
            "operator_id": 1,
            "name": "The beauty of data visualization",
            "type": "",
            "class": "fa fa-newspaper-o"
          },
          {
            "metadata": {"xloc": "310", "yloc": "215"},
            "id": "task_5476278531969",
            "operator_id": 1,
            "name": "Tutorials & Resources to Take Your Decks from Boring to Big Time",
            "type": "",
            "class": "fa fa-video-camera"
          },

          {
            "metadata": {"xloc": "440", "yloc": "280", "color": "#52BE80"},
            "id": "task_5476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o"

          }
        ],
        "connections": [
          {
            "source": "task_5476278401202",
            "relation": "",
            "target": "task_5476278531966"
          },
          {
            "source": "task_5476278531966",
            "relation": "",
            "target": "task_5476278531967"
          },
          {
            "source": "task_5476278531967",
            "relation": "",
            "target": "task_5476278531968"
          },
          {
            "source": "task_5476278531968",
            "relation": "",
            "target": "task_5476278531969"
          },
          {
            "source": "task_5476278531969",
            "relation": "",
            "target": "task_5476278531971"
          }
        ]
      }
    }
    else if (this.level == 2 && this.tech == 'Visualization') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_6476278404202",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_6476278551966",
            "operator_id": 1,
            "name": "PowerPoint Training for Beginners",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_6476278571967",
            "operator_id": 1,
            "name": "Office Support: PowerPoint training",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_6476278581968",
            "operator_id": 1,
            "name": "Storytelling That Moves People",
            "type": "",
            "class": "fa fa-newspaper-o",

          },

          {
            "metadata": {"xloc": "320", "yloc": "220", "color": "#52BE80"},
            "id": "task_6476278581971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_6476278404202",
            "relation": "",
            "target": "task_6476278551966"

          },
          {
            "source": "task_6476278551966",
            "relation": "",
            "target": "task_6476278571967"
          },
          {
            "source": "task_6476278571967",
            "relation": "",
            "target": "task_6476278581968"
          },
          {
            "source": "task_6476278581968",
            "relation": "",
            "target": "task_6476278581971"
          }
        ]
      }
    }
    else if (this.level == 3 && this.tech == 'Visualization') {
      data = {
        "nodes": [
          {
            "metadata": {"xloc": "-104", "yloc": "-25", step: 1},
            "id": "task_7476278401203",
            "operator_id": 1,
            "name": "Start",
            "type": "",
            "class": "fa fa-play",

          },
          {
            "metadata": {"xloc": "-22", "yloc": "36"},
            "id": "task_7476278531966",
            "operator_id": 1,
            "name": "Effective Business Presentations with Powerpoint",
            "type": "",
            "class": "fa fa-book",

          },
          {
            "metadata": {"xloc": "81", "yloc": "99"},
            "id": "task_7476278531967",
            "operator_id": 1,
            "name": "Office Support: PowerPoint 2013 videos and tutorials",
            "type": "",
            "class": "fa fa-video-camera",

          },
          {
            "metadata": {"xloc": "204", "yloc": "158"},
            "id": "task_7476278531968",
            "operator_id": 1,
            "name": "The secret structure of great talks",
            "type": "",
            "class": "fa fa-newspaper-o",

          },
          {
            "metadata": {"xloc": "320", "yloc": "220"},
            "id": "task_7476278531969",
            "operator_id": 1,
            "name": "Presentations That Persuade Online: Creating Power Visuals",
            "type": "",
            "class": "fa fa-newspaper-o",

          },

          {
            "metadata": {"xloc": "420", "yloc": "300", "color": "#52BE80"},
            "id": "task_7476278531971",
            "operator_id": 1,
            "name": "Congratulations!",
            "type": "",
            "class": "fa fa-handshake-o",

          }
        ],
        "connections": [
          {
            "source": "task_7476278401203",
            "relation": "",
            "target": "task_7476278531966"
          },
          {
            "source": "task_7476278531966",
            "relation": "",
            "target": "task_7476278531967"
          },
          {
            "source": "task_7476278531967",
            "relation": "",
            "target": "task_7476278531968"
          },
          {
            "source": "task_7476278531968",
            "relation": "",
            "target": "task_7476278531969"
          },
          {
            "source": "task_7476278531969",
            "relation": "",
            "target": "task_7476278531971"
          }
        ]
      }
    }

    return data;
  }

  ngAfterViewInit() {

    this.flowChart.initGraph('.dynamic-demo .node', this.connections, (info) => this.showDeleteConnectionModal(info), (info) =>  this.beforeDrop(info), (info) => {});
    this.state = true;
  }

  bodyClick() {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
      this.containerElem.nativeElement, 'dispatchEvent', [event]);
  }

  redirectToResults() {
    if (this.workflowRuns.length) {
      let url = `/results/${this.selectedProjectId}/${this.workflowRuns[this.workflowRuns.length - 1]['id']}`;
      this.router.navigateByUrl(url);
    }
    else {
      this.createAlert("No Workflow Runs Available", 2);
    }
  }

  /**
   *   Workflow Actions
   */

  initWorkflow(data) {
    let connections = {};
    let temp_connections = [];
    for (let i in data['connections']) {
      if (data['connections'][i] !== undefined) {
        let source:string = data['connections'][i]['source'];
        if (connections[source] == undefined) {
          connections[source] = [];
        }
        connections[source].push(data['connections'][i]['target']);
        temp_connections.push({
          'sourceId': data['connections'][i]['source'],
          'targetId': data['connections'][i]['target']
        });
      }
    }

    this.connections = connections;

    for (let i in data['nodes']) {
      if (data['nodes'][i] !== undefined) {
        if (data['nodes'][i]['config'] == undefined) {
          data['nodes'][i]['config'] = {};
        }
        this.addNode(new Node(data['nodes'][i]['id'], data['nodes'][i]['type'], data['nodes'][i]['name'], data['nodes'][i]['class'], true, [], data['nodes'][i]['operator_id'], data['nodes'][i]['metadata'], true, data['nodes'][i]['config'], data['nodes'][i]['duration']));
      }
    }
  }

  beforeDrop(info) {
    let state = true;
    let connectionList = this.flowChart.getConnections();
    for (let i in connectionList) {
      if (connectionList[i] !== undefined) {
        if (connectionList[i]['sourceId'] == info['targetId']) {
          state = false;
          return state;
        }
      }
    }
    return state;
  }

  showDeleteConnectionModal(conn) {
    this.conn = conn;
  }

  detach(conn) {
    this.flowChart.detach(conn);
  }

  deleteNode(id) {
    let conn = this.flowChart.deleteNode(id);
    for (let i in this.flowControlNodes) {
      if (this.flowControlNodes[i]['id'] === id) {
        this.flowControlNodes[i]['state'] = false;
        this.flowControlNodes.splice(parseInt(i), 1);
        break;
      }
    }
    return true;
  }

  addNode(node:Node) {
    this.flowControlNodes.push(node);
    return this.flowControlNodes[this.flowControlNodes.length - 1];
  }

  addToGraph($event) {
    let newNode = $event.dragData;
    let temp_id = 'task_' + new Date().getTime();
    newNode['metadata'] = {xloc: $event.mouseEvent.offsetX, yloc: $event.mouseEvent.offsetY};
    let node = this.addNode(new Node(temp_id, newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], true, newNode['config'], newNode.duration));
  }

  nodeMembersDone() {
    this.flowChart.initGraph('.dynamic-demo .node', this.connections, (info) => this.showDeleteConnectionModal(info), (info) =>  this.beforeDrop(info), (info) => {});
  }

  closeModal(modalName, dialogRef) {
    if (modalName == 'createRun') {
      this.workflowRunName = '';
      this.errorMessage = '';
      this.workflowRunNameError = false;
    }
    dialogRef.close(true);

  }

  prepare():void {
    this.isAnyColumnsAdded = true;
  }

  createWorkflowRunFailure(error) {
    if (error == '409') {
      this.errorMessage = "Project name already exists";
    }
    else {
      this.errorMessage = "Unable to process your request. Please try later";
    }
    this.workflowRunNameError = true;
  }

  savePosition() {
    let graph = this.getAllConnections();
    console.log("Save position");
    console.log(graph);
  }

  validateWorkflowNodes() {
    let graph = this.getAllConnections();
    if (graph['error'] == false) {
    } else {
      this.createAlert('Invalid nodes present in workflow', 2);
    }
  }

  getAllConnections() {

    let nodes = [];
    let error = false;
    for (let i in this.flowControlNodes) {
      if (this.flowControlNodes[i] !== undefined) {
        let config = this.flowControlNodes[i]['config']
        let metadata = {
          xloc: String(this.flowControlNodes[i]['metadata']['xloc']),
          yloc: String(this.flowControlNodes[i]['metadata']['yloc'])
        };

        let nodeObj = {
          config: config,
          metadata: metadata,
          id: this.flowControlNodes[i]['id'],
          operator_id: this.flowControlNodes[i]['operator_id']
        };

        if (error == false && this.flowControlNodes[i]['error'] == true) {
          error = true;
        }

        nodes.push(nodeObj);
      }
    }

    let connections = [];
    let connectionList = this.flowChart.getConnections();
    for (let i in connectionList) {
      if (connectionList[i] !== undefined) {
        let connectionsObj = {
          source: connectionList[i]['sourceId'],
          target: connectionList[i]['targetId'],
          metadata: {}
        };

        connections.push(connectionsObj);
      }
    }

    let workflowGraph = {
      "data": {
        "nodes": nodes,
        "connections": connections,
        "name": this.workflowRunName
      }
    };

    return {graph: workflowGraph, error: error};
  }

  setWorkflowRunName() {
    if (this.project['name'] != undefined && this.workflowRuns != undefined && this.workflowRuns.length) {
      this.workflowRunName = this.project['name'] + ' - Run ' + (this.workflowRuns.length + 1);
    } else {
      this.workflowRunName = this.project['name'] + ' - Run ' + 1;
    }
  }

  isNullOrUndefined(param):boolean {
    if (param == null || param == '' || param == undefined) {
      return true;
    } else {
      return false;
    }
  }

  generateArray(obj, columnCount):Array<any> {
    let newArray = [];
    for (let i = 0; i < columnCount; i++) {
      let key = '_c' + i;
      if (obj[key] == undefined) {
        obj[key] = '';
      }
      newArray.push(obj[key]);
    }
    return newArray;
  }

  addFlagItem(item, arr) {
    let index:number = arr.indexOf(item);
    if (index == -1) {
      arr.push(item);
    }
  }

  formatArray(contentArray, contentLength):Array<any> {
    let formattedArray = [];
    for (let i in contentArray) {
      let obj = this.generateArray(contentArray[i], contentLength);
      formattedArray.push(obj);
    }
    return formattedArray;
  }

  // Expand & Collapse Operators
  expandAll() {
    for (let i in this.operators) {
      if (this.operators[i] !== undefined) {
        this.operators[i].state = true;
        this.operators[i].iconClass = 'fa-caret-down';
      }
    }
  };

  collapseAll() {
    for (let i in this.operators) {
      if (this.operators[i] !== undefined) {
        this.operators[i].state = false;
        this.operators[i].iconClass = 'fa-caret-right';
      }
    }
  };

  toggleOperatorsPanel() {
    this.operatorsPanelShown = (this.operatorsPanelShown) ? false : true;
  }

  clearWorkflow() {

    let delete_ids = [];
    for (let i in this.flowControlNodes) {
      if (this.flowControlNodes[i] !== undefined) {
        delete_ids.push(this.flowControlNodes[i]['id']);
      }
    }

    for (let i in delete_ids) {
      if (delete_ids[i] !== undefined) {
        this.deleteNode(delete_ids[i]);
      }
    }
  }

  createAlert(alertMessage, alertType) {
    let data = {alertMessage: alertMessage, alertType: alertType};
    this.alertData.push(data);
  };

  onNotify(message:string):void {
    this.alertData = [];
  }

  showOperatorsAlert() {
    this.createAlert("Please Select Atleast One Operator", 2);
  }

  checkNextNode(node) {
    let getNextNode = this.getNextNode(node['id'], this.flowChart.getConnections());
    return getNextNode['name'];

  }

  resetNextNode(node) {
    let getNextNode = this.getNextNode(node['id'], this.flowChart.getConnections());
    getNextNode['config'] = {};
    getNextNode['error'] = true;
  }

  getNode(id) {
    let node = {};
    for (let i in this.flowControlNodes) {
      if (this.flowControlNodes[i] !== undefined) {
        if (this.flowControlNodes[i]['id'] == id) {
          node = this.flowControlNodes[i];
          break;
        }
      }
    }
    return node;
  }

  getPrevNode(id, connections) {
    let node = {};
    let connectionList = connections;
    for (let i in connectionList) {
      if (connectionList[i] !== undefined) {
        if (connectionList[i]['targetId'] == id) {
          node = this.getNode(connectionList[i]['sourceId']);
        }
      }
    }
    return node;
  }

  getNextNode(id, connections) {
    let node = {};
    let connectionList = connections;
    for (let i in connectionList) {
      if (connectionList[i] !== undefined) {
        if (connectionList[i]['sourceId'] == id) {
          node = this.getNode(connectionList[i]['targetId']);
        }
      }
    }
    return node;
  }

  countUpd_0click(metadata, i, flag = 0, link) {

    var resp;

    let data = this.loadContent();
    if (flag == 1) {
      this.http.post('http://localhost:8080/user/countUpd', {
          'resource_link': link,
          'course_id': this.tech,
          'step': i,
          'level': this.level
        })

        .subscribe((res) => {
          console.log("some sentence", i);
          resp = res;
          console.log(resp["_body"]);

        });

    }
    window.location.href = link;

    console.log('meta Data');
    console.log(metadata.xloc)
    //metadata.color='orange'
    console.log(metadata);
    if (metadata.step != undefined) {
      this.step = metadata.step;
    } else {
      this.step = i;
    }

  }


  showStep(metadata, i, flag = 0) {
    let data = this.loadContent();

    if (flag == 1) {
      this.http.post('http://localhost:4040/user/courseUpd', {
          'user_id': this.authService.getId(),
          'course_id': this.tech,
          'step': i - 1,
          'level': this.level,
          'status': 'Completed'
        })
        .map((res) => {
          console.log((res));

        })
        .subscribe(
          data => {
            console.log("No error")
            //console.log("brandList:"+JSON.parse(res["_body"]));
          },
          error => {
            console.log(error)
          });

    }

    metadata.color = 'orange'
    if (metadata.step != undefined) {
      this.step = metadata.step;
    } else {
      this.step = i;
    }

  }

}
