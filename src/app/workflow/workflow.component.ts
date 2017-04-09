import { trigger, state, style, transition, animate, Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Node }  from './node';
import { FlowchartComponent } from './../shared/components/flowchart/flowchart.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

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
    operators : Array<Node> = [];
    flowControlNodes: Array<Node> = [];
    state: boolean;
    operatorsPanelShown: boolean;
    selectedProjectId: any;
    connections = {};
    modalSize: string;
    workflowRunName:string;
    workflowRunNameError: boolean;
    errorMessage :string;
    userDetails :any;
    alertData = [];
    workflowRuns =[];
    selectedFolder:any;
    selectedFile: any;
    availableFileNodes:any;
    currentNode: any;
    exportCSVForm: any;
    conn: any;
    operatorConfig = {};
    isAnyColumnsAdded: boolean;
    outputOptions: any;
    selectedOutputOptions :string;
    inputCol: boolean;
    outputCol : boolean;
    modalError: string;
    selectedInputOptions: any;


    columns: any[];
    private selectedOptions: number[];
    schemaList =[];
    addedColumnsFlag =[];
    newColumns =[];
    public dataset: any;
    public columnSchemaCloned: any;
    public config: any;

    tech: string;
    level: number;
    step: number;
    section: string;

    @ViewChild('defaultModal') defaultModal: TemplateRef<any>;
    @ViewChild('loadDatasetModal') loadDatasetModal: TemplateRef<any>;
    @ViewChild('outputCSVModal') outputCSVModal: TemplateRef<any>;
    @ViewChild('decisionTreeModal') decisionTreeModal: TemplateRef<any>;
    @ViewChild('addColumnModal') addColumnModal: TemplateRef<any>;
    @ViewChild('joinDatasetModal') joinDatasetModal: TemplateRef<any>;
    @ViewChild('quickSummaryModal') quickSummaryModal: TemplateRef<any>;
    @ViewChild('clearWorkflowModal') clearWorkflowModal: TemplateRef<any>;
    @ViewChild('inputWorkflowRunMetadata') inputWorkflowRunMetadata: TemplateRef<any>;
    @ViewChild('inputWorkflowMetadata') inputWorkflowMetadata: TemplateRef<any>;
    @ViewChild('confirmConnectionDeleteModal') confirmConnectionDeleteModal: TemplateRef<any>;
    @ViewChild('containerElem') containerElem:ElementRef;

    constructor(private route: ActivatedRoute, public router: Router,
                public flowChart: FlowchartComponent,
                public renderer: Renderer) {
        this.modalSize = 'default-lg';
        this.workflowRunName = '';
        this.workflowRunNameError= false;
        this.operatorsPanelShown = true;
        this.dataset = null;
        this.selectedOutputOptions = '';
        this.modalError = '';
        this.selectedOptions = [];
        this.section = 'courseFlow';
        this.tech = "SQL";
        this.level = 1;
        this.step = 1;

        this.columns= [{"name": "column1"},{"name": "column2"},{"name": "column3"},{"name": "column4"},{"name": "column5"},{"name": "column6"},{"name": "column7"},{"name": "column8"}];

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
        this.initSelectedFile();
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let project_id = params['project_id'];
            this.selectedProjectId = project_id;
        });

      let data = {
        "nodes":[
          {
            "metadata":{"xloc":"-104","yloc":"-25", step: 1},
            "id":"task_1476278401202",
            "operator_id":1,
            "name":"Start",
            "type":"",
            "class":"fa fa-play",
            "duration": null
          },
          {
            "metadata":{"xloc":"-22","yloc":"36"},
            "id":"task_1476278531966",
            "operator_id":1,
            "name":"Introduction to SQL",
            "type":"",
            "class":"fa fa-book",
            "duration": "1 hour"
          },
          {
            "metadata":{"xloc":"81","yloc":"99"},
            "id":"task_1476278531967",
            "operator_id":1,
            "name":"Understand syntaxing a query",
            "type":"",
            "class":"fa fa-video-camera",
            "duration": "4 hours"
          },
          {
            "metadata":{"xloc":"204","yloc":"158"},
            "id":"task_1476278531968",
            "operator_id":1,
            "name":"Practice your queries",
            "type":"",
            "class":"fa fa-newspaper-o",
            "duration": "3 hours"
          },
          {
            "metadata":{"xloc":"305","yloc":"215"},
            "id":"task_1476278531969",
            "operator_id":1,
            "name":"Know more about RDBMS",
            "type":"",
            "class":"fa fa-video-camera",
            "duration": "40 hours"
          },
          {
            "metadata":{"xloc":"427","yloc":"286"},
            "id":"task_1476278531970",
            "operator_id":1,
            "name":"Practice your RDBMS concepts",
            "type":"",
            "class":"fa fa-newspaper-o",
            "duration": "3 hours"
          },
          {
            "metadata":{"xloc":"555","yloc":"333", "color": "#52BE80"},
            "id":"task_1476278531971",
            "operator_id":1,
            "name":"Congratulations!",
            "type":"",
            "class":"fa fa-handshake-o",

          }
        ],
        "connections":[
          {
            "source":"task_1476278401202",
            "relation":"",
            "target":"task_1476278531966"
          },
          {
            "source":"task_1476278531966",
            "relation":"",
            "target":"task_1476278531967"
          },
          {
            "source":"task_1476278531967",
            "relation":"",
            "target":"task_1476278531968"
          },
          {
            "source":"task_1476278531968",
            "relation":"",
            "target":"task_1476278531969"
          },
          {
            "source":"task_1476278531969",
            "relation":"",
            "target":"task_1476278531970"
          },
          {
            "source":"task_1476278531970",
            "relation":"",
            "target":"task_1476278531971"
          }
        ]
      };

      //let data = {"nodes":
      //  [{"config":{},"metadata":{"xloc":"-104","yloc":"-25"},"id":"task_1476278401202","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"-22","yloc":"36"},"id":"task_1476278531966","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"81","yloc":"99"},"id":"task_1476278531967","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"204","yloc":"158"},"id":"task_1476278531968","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"305","yloc":"215"},"id":"task_1476278531969","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"427","yloc":"286"},"id":"task_1476278531970","operator_id":1},
      //    {"config":{},"metadata":{"xloc":"555","yloc":"333"},"id":"task_1476278531971","operator_id":1}],"connections":[{"source":"task_1476278401202","target":"task_1476278531966","metadata":{}},{"source":"task_1476278531966","target":"task_1476278531967","metadata":{}},{"source":"task_1476278531967","target":"task_1476278531968","metadata":{}},{"source":"task_1476278531968","target":"task_1476278531969","metadata":{}},{"source":"task_1476278531969","target":"task_1476278531970","metadata":{}},{"source":"task_1476278531970","target":"task_1476278531971","metadata":{}}],"name":""};

      //let data = {
        //  "nodes":[
        //    {
        //      "metadata":{
        //        "yloc":"30",
        //        "xloc":"30"
        //      },
        //      "id":"task_1476278401202",
        //      "operator_id":1,
        //      "name":"Start",
        //      "type":"",
        //      "class":"fa fa-play",
        //      "duration": null
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"30",
        //        "xloc":"320"
        //      },
        //      "id":"task_1476278531966",
        //      "operator_id":1,
        //      "name":"Introduction to SQL",
        //      "type":"",
        //      "class":"fa fa-book",
        //      "duration": "1 hour"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"30",
        //        "xloc":"610"
        //      },
        //      "id":"task_1476278531967",
        //      "operator_id":1,
        //      "name":"Understanding and syntaxing a query",
        //      "type":"",
        //      "class":"fa fa-video-camera",
        //      "duration": "4 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"180",
        //        "xloc":"610"
        //      },
        //      "id":"task_1476278531968",
        //      "operator_id":1,
        //      "name":"Practice your queries",
        //      "type":"",
        //      "class":"fa fa-newspaper-o",
        //      "duration": "3 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"330",
        //        "xloc":"610"
        //      },
        //      "id":"task_1476278531969",
        //      "operator_id":1,
        //      "name":"Know more about RDBMS",
        //      "type":"",
        //      "class":"fa fa-video-camera",
        //      "duration": "40 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"330",
        //        "xloc":"320"
        //      },
        //      "id":"task_1476278531970",
        //      "operator_id":1,
        //      "name":"Practice your RDBMS concepts",
        //      "type":"",
        //      "class":"fa fa-newspaper-o",
        //      "duration": "3 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"330",
        //        "xloc":"30",
        //        "color": "#52BE80"
        //      },
        //      "id":"task_1476278531971",
        //      "operator_id":1,
        //      "name":"Beginner courses completed",
        //      "type":"",
        //      "class":"fa fa-handshake-o",
        //
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"480",
        //        "xloc":"30",
        //      },
        //      "id":"task_1476278531972",
        //      "operator_id":1,
        //      "name":"SQL Aggregation",
        //      "type":"",
        //      "class":"fa fa-empire",
        //      "duration": "3 hours"
        //
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"630",
        //        "xloc":"30",
        //      },
        //      "id":"task_1476278531973",
        //      "operator_id":1,
        //      "name":"Join",
        //      "type":"",
        //      "class":"fa fa-plus",
        //      "duration": "4 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"630",
        //        "xloc":"320",
        //      },
        //      "id":"task_1476278531974",
        //      "operator_id":1,
        //      "name":"Sub queries",
        //      "type":"",
        //      "class":"fa fa-question",
        //      "duration": "3 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"630",
        //        "xloc":"610",
        //      },
        //      "id":"task_1476278531975",
        //      "operator_id":1,
        //      "name":"Practice your queries",
        //      "type":"",
        //      "class":"fa fa-newspaper-o",
        //      "duration": "4 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"780",
        //        "xloc":"610",
        //      },
        //      "id":"task_1476278531976",
        //      "operator_id":1,
        //      "name":"SQL quiz",
        //      "type":"",
        //      "class":"fa fa-puzzle-piece",
        //      "duration": "1 hour"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"930",
        //        "xloc":"610",
        //      },
        //      "id":"task_1476278531977",
        //      "operator_id":1,
        //      "name":"Courses offered by Standford",
        //      "type":"",
        //      "class":"fa fa-university",
        //      "duration": "18 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"930",
        //        "xloc":"320",
        //        "color":  "#229954"
        //      },
        //      "id":"task_1476278531978",
        //      "operator_id":1,
        //      "name":"Intermediate Acheived",
        //      "type":"",
        //      "class":"fa fa-handshake-o"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"930",
        //        "xloc":"30",
        //      },
        //      "id":"task_1476278531979",
        //      "operator_id":1,
        //      "name":"Advanced",
        //      "type":"",
        //      "class":"fa fa-cogs"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"1080",
        //        "xloc":"30",
        //      },
        //      "id":"task_1476278531980",
        //      "operator_id":1,
        //      "name":"Connect python to database",
        //      "type":"",
        //      "class":"fa fa-link",
        //      "duration": "4 weeks"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"1230",
        //        "xloc":"30",
        //      },
        //      "id":"task_1476278531981",
        //      "operator_id":1,
        //      "name":"Use analytical elements of SQL",
        //      "type":"",
        //      "class":"fa fa-snowflake-o",
        //      "duration": "42 hours"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"1230",
        //        "xloc":"320",
        //      },
        //      "id":"task_1476278531982",
        //      "operator_id":1,
        //      "name":"Ebook with illustrations",
        //      "type":"",
        //      "class":"fa fa-book"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"1230",
        //        "xloc":"610",
        //      },
        //      "id":"task_1476278531983",
        //      "operator_id":1,
        //      "name":"SQL puzzles",
        //      "type":"",
        //      "class":"fa fa-puzzle-piece"
        //    },
        //    {
        //      "metadata":{
        //        "yloc":"1380",
        //        "xloc":"610",
        //        "color": "#145A32"
        //      },
        //      "id":"task_1476278531984",
        //      "operator_id":1,
        //      "name":"You are an Expert",
        //      "type":"",
        //      "class":"fa fa-graduation-cap"
        //    },
        //  ],
        //  "connections":[
        //    {
        //      "source":"task_1476278401202",
        //      "relation":"",
        //      "target":"task_1476278531966"
        //    },
        //    {
        //      "source":"task_1476278531966",
        //      "relation":"",
        //      "target":"task_1476278531967"
        //    },
        //    {
        //      "source":"task_1476278531967",
        //      "relation":"",
        //      "target":"task_1476278531968"
        //    },
        //    {
        //      "source":"task_1476278531968",
        //      "relation":"",
        //      "target":"task_1476278531969"
        //    },
        //    {
        //      "source":"task_1476278531969",
        //      "relation":"",
        //      "target":"task_1476278531970"
        //    },
        //    {
        //      "source":"task_1476278531970",
        //      "relation":"",
        //      "target":"task_1476278531971"
        //    },
        //    {
        //      "source":"task_1476278531971",
        //      "relation":"",
        //      "target":"task_1476278531972"
        //    },
        //    {
        //      "source":"task_1476278531972",
        //      "relation":"",
        //      "target":"task_1476278531973"
        //    },
        //    {
        //      "source":"task_1476278531973",
        //      "relation":"",
        //      "target":"task_1476278531974"
        //    },
        //    {
        //      "source":"task_1476278531974",
        //      "relation":"",
        //      "target":"task_1476278531975"
        //    },
        //    {
        //      "source":"task_1476278531975",
        //      "relation":"",
        //      "target":"task_1476278531976"
        //    },
        //    {
        //      "source":"task_1476278531976",
        //      "relation":"",
        //      "target":"task_1476278531977"
        //    },
        //    {
        //      "source":"task_1476278531977",
        //      "relation":"",
        //      "target":"task_1476278531978"
        //    },
        //    {
        //      "source":"task_1476278531978",
        //      "relation":"",
        //      "target":"task_1476278531979"
        //    },
        //    {
        //      "source":"task_1476278531979",
        //      "relation":"",
        //      "target":"task_1476278531980"
        //    },
        //    {
        //      "source":"task_1476278531980",
        //      "relation":"",
        //      "target":"task_1476278531981"
        //    },
        //    {
        //      "source":"task_1476278531981",
        //      "relation":"",
        //      "target":"task_1476278531982"
        //    },
        //    {
        //      "source":"task_1476278531982",
        //      "relation":"",
        //      "target":"task_1476278531983"
        //    },
        //    {
        //      "source":"task_1476278531983",
        //      "relation":"",
        //      "target":"task_1476278531984"
        //    }
        //  ]
        //};

        this.initWorkflow(data);

    }

    ngAfterViewInit() {
        this.flowChart.initGraph('.dynamic-demo .node', this.connections, (info) => this.showDeleteConnectionModal(info), (info) =>  this.beforeDrop(info), (info) => this.connection(info));
        this.state = true;
    }

    bodyClick() {
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
            this.containerElem.nativeElement, 'dispatchEvent', [event]);
    }

    redirectToResults() {
        if (this.workflowRuns.length) {
            let url = `/results/${this.selectedProjectId}/${this.workflowRuns[this.workflowRuns.length-1]['id']}`;
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
                let source: string = data['connections'][i]['source'];
                if (connections[source] == undefined) {
                    connections[source] = [];
                }
                connections[source].push(data['connections'][i]['target']);
                temp_connections.push({'sourceId': data['connections'][i]['source'], 'targetId': data['connections'][i]['target']});
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

        for (let i in this.flowControlNodes) {
            let node = this.flowControlNodes[i];
            let error = this.validateNodeData(node['operator_id'], node, temp_connections);
            node['error'] = error;
        }
    }

    validateSourceTargetNode(conn) {
        if (conn['sourceId'] != undefined) {
            let sourceNode = this.getNode(conn['sourceId']);
            sourceNode['error'] = this.validateNodeData(sourceNode['operator_id'], sourceNode, this.flowChart.getConnections());
        }

        if (conn['targetId'] != undefined) {
            let targetNode = this.getNode(conn['targetId']);
            targetNode['error'] = this.validateNodeData(targetNode['operator_id'], targetNode, this.flowChart.getConnections());
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

    connection(info) {
        this.validateSourceTargetNode(info);
    }

    showDeleteConnectionModal(conn) {
        this.conn = conn;
    }

    detach(conn) {
        this.flowChart.detach(conn);
        this.validateSourceTargetNode(conn);
    }

    deleteNode(id) {
        let conn = this.flowChart.deleteNode(id);
        this.validateSourceTargetNode(conn);
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
        return this.flowControlNodes[this.flowControlNodes.length-1];
    }

    addToGraph($event) {
        let newNode = $event.dragData;
        let temp_id = 'task_' + new Date().getTime();
        newNode['metadata'] = { xloc: $event.mouseEvent.offsetX, yloc: $event.mouseEvent.offsetY};
        let node = this.addNode(new Node(temp_id, newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], true, newNode['config'], newNode.duration));
        node['error'] = this.initNodes(newNode.id, newNode);
    }

    nodeMembersDone() {
        if (this.state) {
            let lastNode = this.flowControlNodes.length;
            this.flowChart.updateGraph('.dynamic-demo .node:nth-child(' + lastNode + ')');
        }
    }

    validateWorkflowRunName() {
        this.errorMessage = "WorkflowRun name should be 3-30 characters and contain only alphabets, numbers or special characters (-, _)";
        var illegalChars = /^[ A-Za-z0-9_-]*$/;
        if (!illegalChars.test(this.workflowRunName)) {
            this.workflowRunNameError = true;
        }
        else if (this.workflowRunName.length < 3) {
            this.workflowRunNameError = true
        }
        else {
            this.workflowRunNameError = false;
            this.errorMessage = '';
        }
        return this.workflowRunNameError;
    }

    createWorkflowRunSuccess(dialogRef) {
        this.closeModal('createRun',dialogRef);
        this.createAlert("Workflow task(s) submitted successfully",1);
    }

    closeModal(modalName, dialogRef) {
        if (modalName == 'createRun' ) {
            this.workflowRunName = '';
            this.errorMessage = '';
            this.workflowRunNameError = false;
        }
        dialogRef.close(true);

    }
    prepare(): void {
        this.isAnyColumnsAdded = true;
    }

    validateAddColumn() :void{
        this.currentNode['error'] =this.validateNodeData(this.currentNode['operator_id'], this.currentNode, this.flowChart.getConnections())

    }
    createWorkflowRunFailure(error){
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
                let metadata = { xloc: String(this.flowControlNodes[i]['metadata']['xloc']), yloc: String(this.flowControlNodes[i]['metadata']['yloc'])};

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
                "name" : this.workflowRunName
            }
        };

        return { graph: workflowGraph, error: error };
    }

    setWorkflowRunName() {
        if (this.project['name'] != undefined && this.workflowRuns != undefined && this.workflowRuns.length) {
            this.workflowRunName = this.project['name'] + ' - Run ' + (this.workflowRuns.length+1);
        } else {
            this.workflowRunName = this.project['name'] + ' - Run ' + 1;
        }
    }

    getDatasetDataFailure(ex) {
        this.createAlert('Unable to process your request. Please try later.', 2);
    }

    isNullOrUndefined(param): boolean {
        if(param == null || param == '' || param == undefined){ return true; }else {
            return false;
        }
    }
    generateArray(obj, columnCount): Array<any> {
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
        let index: number = arr.indexOf(item);
        if (index == -1) {
            arr.push(item);
        }
    }

    cloneDatasetColumnSchema(datasetSchema): void {
        let new_schema = {};
        let schemaList = [];

        for (let i = 0; i < datasetSchema.length; i++) {
            let formula: string = '';
            if(!this.isNullOrUndefined(datasetSchema[i]['formula'])) {
                formula = datasetSchema[i]['formula'];
            }
            let obj = {
                ignore: false,
                name: datasetSchema[i]['column_name'],
                type: datasetSchema[i]['data_type'],
                format: datasetSchema[i]['format'],
                dirty: false,
                new_column: false,
                is_calculated: datasetSchema[i]['is_calculated'],
                formula: formula,
                column_num: i + 1
            };
            schemaList.push(obj);
        }

        for (let i in schemaList) {
            new_schema[i] = schemaList[i];
        }
        this.columnSchemaCloned = new_schema;
    }

    formatArray(contentArray, contentLength): Array<any> {
        let formattedArray = [];
        for (let i in contentArray) {
            let obj = this.generateArray(contentArray[i], contentLength);
            formattedArray.push(obj);
        }
        return formattedArray;
    }

    configureNode(node) {

        this.loadNodeModalData(node);
        this.bodyClick();
    }

    public menuOptions = [
        {
           html: () => '<span class="context-menu-item"><i class="fa fa-info-circle ico-primary padR15"></i><span>Configure</span></span>',
           click: (item, $event):void => {
               this.configureNode(item);
           }
        },
        {
            html: () => '<span class="context-menu-item"><i class="fa fa-close text-danger padR15"></i><span class="text-danger">Delete</span></span>',
            click: (item, $event) => {
                this.deleteNode(item.id);
                this.bodyClick();
            }
        }
    ];

    public defaultMenuOptions = [
        {
            html: () => '<span class="context-menu-item"><i class="fa fa-close text-danger padR15"></i><span class="text-danger">Delete</span></span>',
            click: (item, $event) => {
                this.deleteNode(item.id);
                this.bodyClick();
            }
        }
    ];

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

    onNotify(message: string): void {
        this.alertData = [];
    }

    showOperatorsAlert() {
        this.createAlert("Please Select Atleast One Operator", 2);
    }

    onSelected(node) {
        this.selectedFolder = node;
        this.initSelectedFile();
    }

    selectFolder(folder, node) {
        this.selectedFolder = folder;
        node['selectedFile'] = {id: '', name: '', type: ''};
    }

    onSelectedFile(node) {
        this.selectedFile = node;
    }

    checkNextNode(node) {
        let getNextNode = this.getNextNode(node['id'], this.flowChart.getConnections());
        return getNextNode['name'];

    }

    resetNextNode(node){
        let getNextNode = this.getNextNode(node['id'], this.flowChart.getConnections());
         getNextNode['config'] = {};
         getNextNode['error'] = true;
    }
    resetSchema() {
        this.schemaList =[];
        this.addedColumnsFlag =[];
        this.newColumns =[];
    }
    resetInputOutputColumns() {
        this.selectedOutputOptions = '';
        this.selectedInputOptions = [];
        this.selectedOptions = [];
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

    initSelectedFileFolder() {
        this.initSelectedFile();
        this.initSelectedFolder();
    }

    initSelectedFile() {
        this.selectedFile = {id: '', name: '', type: ''};
    };

    initSelectedFolder() {
        let repoList = this.availableFileNodes;
        this.selectedFolder = repoList;

        if (repoList['children'] != undefined) {
            for (let i in repoList['children']) {
                if (repoList['children'][i]['name'] == "datasets") {
                    this.selectedFolder = repoList['children'][i];
                    break;
                }
            }
        }

        // this.selectedFolder = {id: '', name: '', type: ''};
    }

    initNodes(operator_id, node) {

        var error = true;
        switch (operator_id) {
            case this.operatorConfig['helloWorld']:
                error = false;
                break;
            case this.operatorConfig['loadDataset']:
                if (node["config"] == undefined) {
                    node["config"] = { path: ''};
                } else {
                    node['config']['path'] =  "";
                }
                this.initSelectedFileFolder();
                error = true;
                break;
            case this.operatorConfig['exportCSV']:

                node['config'] = { 'dataset_name': '', 'overwrite': 'false'};

                error = true;
                break;
            case this.operatorConfig['decisionTree']:
                node['config'] = { columns:  []};
                error = true;
                break;
            case this.operatorConfig['addColumn']:
                node['config'] = { columns:  []};
                error = true;
                break;
        }

        return error;
    }

    validateNodeData(operator_id, node, connections) {

        let error = true;
        let prevNode;
        let nextNode;
        switch (operator_id) {
            case this.operatorConfig['helloWorld']:
                error = false;
                break;
            case this.operatorConfig['loadDataset']:
                if (node['selectedFile'] != undefined && node['selectedFolder'] != undefined) {
                    this.selectedFile = node['selectedFile'];
                    this.selectedFolder = node['selectedFolder'];
                    error = false;
                } else {
                    if (node['config'] == undefined) {
                        node['config'] = { path: ''};
                        this.initSelectedFileFolder();
                        error = true;
                    } else {
                        if (node['config']['path'] == undefined || node['config']['path'] == '') {
                            error = true;
                            node['config'] = { path: ''};
                            this.initSelectedFileFolder();
                        } else {
                            if (node['config']['path'] != undefined && node['config']['path'] != '') {
                                let temp;
                                if (temp['selectedFile'] != undefined) {
                                    this.selectedFile = temp['selectedFile'];
                                    node['selectedFile'] = temp['selectedFile'];
                                }

                                if (temp['selectedFolder'] != undefined) {
                                    this.selectedFolder = temp['selectedFolder'];
                                }
                            }
                            error = false;
                        }
                    }
                }
                break;
            case this.operatorConfig['exportCSV']:
                if (node['exportCSVForm'] != undefined) {
                    this.exportCSVForm = node['exportCSVForm'];
                    error = false;
                } else {
                    if (node['config'] == undefined) {
                        error = true;
                        node['config'] = {dataset_name: '', overwrite: "false"};

                    } else {
                        if (node['config']['dataset_name'] == undefined || node['config']['overwrite'] == undefined || node['config']['dataset_name'] == '') {
                            error = true;
                            node['config'] = {dataset_name: '', overwrite: "false"};

                        } else {
                            error = false;
                        }

                        if (node['config']['dataset_name'] != undefined && node['config']['overwrite'] != undefined ) {

                            let overwrite = false;
                            if (node['config']['overwrite'] == "true") {
                                overwrite = true;
                            }
                        }
                    }
                }

                prevNode = this.getPrevNode(node['id'], connections);
                if (prevNode['operator_id'] == undefined || (prevNode['operator_id'] != this.operatorConfig['loadDataset'] && prevNode['operator_id'] != this.operatorConfig['addColumn'])) {
                    error = true;
                }
                break;
            case this.operatorConfig['decisionTree']:
                if (node['config'] == undefined) {
                    error = true;
                    node['config'] = {decisionColumn: {inputColumn: '', outputColumn: ''}};
                } else {
                    if (node['config']['decisionColumn'] == undefined  || node['config']['decisionColumn'] == '') {
                        error = true;
                        node['config'] = {decisionColumn: {inputColumn: '', outputColumn: ''}};
                    } else {
                        error = false;
                    }
                    if (node['config']['decisionColumn'] != undefined  ) {
                            node['config']['decisionColumn'] = node['config']['decisionColumn'];
                    }

                }
                prevNode = this.getPrevNode(node['id'], connections);
                // nextNode = this.getNextNode(node['id'], connections);

                if (prevNode['operator_id'] == undefined || prevNode['operator_id'] != this.operatorConfig['loadDataset']) {
                    error = true;
                }
                // if (nextNode == undefined || nextNode['operator_id'] == undefined || nextNode['operator_id'] != this.operatorConfig['exportCSV']) {
                //     error = true;
                // }
               // console.log(node);
                break;
            case this.operatorConfig['addColumn']:
                if (node['config'] == undefined) {
                    error = true;
                    node['config'] = {newcolumn: ''};
                } else {
                    if (node['config']['newcolumn'] == undefined  || node['config']['newcolumn'] == '') {
                        error = true;
                        node['config'] = {newcolumn: ''};
                    } else {
                        error = false;
                    }
                    if (node['config']['newcolumn'] != undefined  ) {

                        if(typeof node['config']['newcolumn'] == 'string' &&  node['config']['newcolumn']!= ''){
                            let newColumnData = JSON.parse(node['config']['newcolumn']);
                            node['config']['newcolumn'] = newColumnData;
                        }
                    }

                }
                prevNode = this.getPrevNode(node['id'], connections);
               // nextNode = this.getNextNode(node['id'], connections);

                if (prevNode['operator_id'] == undefined || prevNode['operator_id'] != this.operatorConfig['loadDataset']) {
                    error = true;
                }
                // if (nextNode == undefined || nextNode['operator_id'] == undefined || nextNode['operator_id'] != this.operatorConfig['exportCSV']) {
                //     error = true;
                // }
                break;
        }

        return error;
    }

    loadNodeModalData(node) {
        this.currentNode = node;
        this.validateNodeData(node.operator_id, node, this.flowChart.getConnections());
    }

    updateLoadDatasetMetadata(node) {

        let old_file =  node['selectedFile'];

        node['selectedFile'] = this.selectedFile;
        node['selectedFolder'] = this.selectedFolder;
        if(!this.isNullOrUndefined(old_file)){
            if(old_file.name != this.selectedFile.name){

                if(this.checkNextNode(node) == 'Add Column') {
                    this.resetNextNode(node);
                    this.resetSchema();
                }
                else if(this.checkNextNode(node) == 'Decision Tree') {
                    this.resetNextNode(node);
                    this.resetInputOutputColumns();
                }
            }
        }

        node.error = this.validateNodeData(node['operator_id'], node, this.flowChart.getConnections());

        this.initSelectedFileFolder();

    }

    updateDecisionTreeNode(node) {
        if (node['config'] == undefined || node['config']['decisionColumn'] == undefined) {
            node['config'] = { decisionColumn: {inputColumn: this.selectedInputOptions, outputColumn: this.selectedOutputOptions} };
        }
        else {
            node['config']['decisionColumn'] =  {inputColumn: this.selectedInputOptions, outputColumn: this.selectedOutputOptions} ;
        }
        node['error'] = this.validateNodeData(node['operator_id'], node, this.flowChart.getConnections());
    }

    updateAddColumnNode(node) {
        if (node['config'] == undefined || node['config']['newcolumn'] == undefined) {
            node['config'] = { newcolumn: this.newColumns };
        }
        else {
            node['config']['newcolumn'] = this.newColumns;
        }
        node['error'] = this.validateNodeData(node['operator_id'], node, this.flowChart.getConnections());
    }

    updateExportCSVNode(node) {
        if (node['config'] == undefined || node['config']['dataset_name'] == undefined) {
            node['config'] = { dataset_name: this.exportCSVForm.value.datasetName };
        } else {
            node['config']['dataset_name'] = this.exportCSVForm.value.datasetName;
        }

        if (node['config']['overwrite'] == undefined) {
            node['config']['overwrite'] = "false";
        }

        if (this.exportCSVForm.value.overwrite) {
            node['config']['overwrite'] = "true";
        } else {
            node['config']['overwrite'] = "false";
        }

        node['exportCSVForm'] = this.exportCSVForm;
        node.error = this.validateNodeData(node['operator_id'], node, this.flowChart.getConnections());
    }

    updateOutputOption(value) {
        this.selectedOutputOptions = value;
    }

    emptyElement(element) {
    //Removes nulls a
        if (element == null)
            return false;
        else
            return true;
    }
    deepCopy(oldObj: any) {
        var newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (var i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    }

    updateOutputColumns(options) {

    }


    showNext() {

    }
    resetConfig(dialogRef) {
        this.selectedOptions = [];
        this.outputOptions = [];
        this.selectedOutputOptions = '';
        this.inputCol = true;
        this.outputCol = false;
        dialogRef.close(true);

    }

    showPrevious() {
        this.inputCol = true;
        this.outputCol = false;
    }

    validateOuptputColumn(dialogRef,  node){
        if(this.selectedOutputOptions != '') {
            this.modalError = '';
            this.updateNode(dialogRef,  node);
        }
        else {
            this.modalError = "Please selected output column ";
        }
    }

    updateNode(dialogRef,  node) {
        if (node != undefined) {
            switch (node['operator_id']) {
                case this.operatorConfig['loadDataset']:
                    this.updateLoadDatasetMetadata(node);
                    break;
                case this.operatorConfig['exportCSV']:
                    this.updateExportCSVNode(node);
                    break;
                case this.operatorConfig['decisionTree']:
                    this.updateDecisionTreeNode(node);
                    break;
                case this.operatorConfig['addColumn']:
                    this.updateAddColumnNode(node);
                    break;
            }
        }
        if(node['operator_id']!= this.operatorConfig['addColumn']){
            dialogRef.close(true);
        }

    }

    showStep(metadata, i) {
      console.log(metadata                                                                                                    );
      if(metadata.step != undefined){
        this.step = metadata.step;
      }else{
        this.step = i;
      }
    }

    goToNextLevel() {
      this.level += 1;
      this.step = 1;
    }
}
