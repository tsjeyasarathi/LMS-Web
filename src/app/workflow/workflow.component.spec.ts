import {async, TestBed, inject } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule, Http, Response, RequestOptions, Headers } from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MockActivatedRoute} from '../../test_mocks/routes';
import { Observable } from 'rxjs';

// Third party components
import { DndModule } from 'ng2-dnd';
import {ContextMenuComponent} from 'angular2-contextmenu/src/contextMenu.component';
import {ContextMenuService} from 'angular2-contextmenu/src/contextMenu.service';
import {ModalModule} from 'angular2-modal';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {VexModalModule} from 'angular2-modal/plugins/vex';
import { Node }  from './node';

// Amplifyr components
import {WorkflowComponent} from '../workflow/workflow.component';
import {LastDirectiveComponent} from '../shared/components/last-directive/last-directive.component';
import {CustomModalVexComponent} from '../shared/components/custom-modal-vex/custom-modal-vex.component';
import {FlowchartComponent} from '../shared/components/flowchart/flowchart.component';
import {AlertInfoComponent} from '../shared/components/alert-info/alert-info.component';
import {WorkflowService} from '../shared/services/workflow.service';
import {ProjectsService} from '../shared/services/projects.service';
import {WorkflowRunService} from '../shared/services/workflow-run.service';
import {PositionDirective} from '../workflow/position.directive';
import {Auth} from '../shared/services/auth.service';
import {OperatorsService} from '../shared/services/operators.service';
import {ValidationService} from "../shared/services/validation.service";
import { UtilService } from '../shared/services/util.service';
import { UserStoreService } from './../shared/services/user-store.service';

describe('Component: Workflow', () => {
    let comp: WorkflowComponent;
    let router: Router;
    let mockActivatedRoute: MockActivatedRoute;
    let fixture: any;
    let flowChartComponent: any;
    let workflowService: any;
    let operatorsService: any;
    let projectsService: any;
    let authService: any;
    let userStoreService: any;
    let workflowRunService: any;
    let customModalVexComponent: any;
    let utilService: any;

    let mockWorkflowRuns = [
        {
            "data": {
                "workflow-run-tasks": [
                    {
                        "id": 1,
                        "name": "WFRun_Tasks_1",
                        "status": "started",
                        "start_date": "2016-10-04 00:00:00.0",
                        "end_date": "2016-10-12 00:00:00.0"
                    },
                    {
                        "id": 2,
                        "name": "WFRun_Tasks_2",
                        "status": "completed",
                        "start_date": "2016-10-04 00:00:00.0",
                        "end_date": "2016-10-12 00:00:00.0"
                    }
                ]
            }
        }
    ];

    beforeEach(() => {
        mockActivatedRoute = new MockActivatedRoute({'project_id': 2}, {
            'workflow': {
                'data': {
                    'nodes': [],
                    'connections': []
                }
            }, 'runs': {'data': []},
            'repoList': []
        });

        authService = jasmine.createSpyObj('authService', ['getEmittedValue', 'logout', 'authenticated', 'change']);
        router = jasmine.createSpyObj("Router", ['navigate', 'navigateByUrl']);
        flowChartComponent = jasmine.createSpyObj('FlowchartComponent', ['getInstance', 'initGraph', 'getConnections', 'detach', 'updateGraph', 'getEndpoints', 'deleteNode']);
        workflowService = jasmine.createSpyObj('WorkflowService', ['getWorkflow', 'createWorkflow', 'updateWorkflow', 'deleteWorkflow']);
        operatorsService = jasmine.createSpyObj('OperatorsService', ['getOperators']);
        projectsService = jasmine.createSpyObj('ProjectsService', ['getProjects', 'getProject', 'createProject', 'renameProject', 'deleteProject']);
        userStoreService = jasmine.createSpyObj('UserStoreService', ['getRepositoryPathList']);
        workflowRunService = jasmine.createSpyObj('WorkflowRunService', ['createWorkflowRun', 'getAllWorkflowRuns']);
        customModalVexComponent = jasmine.createSpyObj('CustomModalVexComponent', ['createModal']);
        utilService = jasmine.createSpyObj('UtilService', ['getSelectedFileAndNode', 'getSelectedFolderPath', 'getTime', 'fillPath']);
        TestBed.configureTestingModule({
            declarations: [
                ContextMenuComponent,
                WorkflowComponent,
                LastDirectiveComponent,
                AlertInfoComponent,
                PositionDirective,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpModule,
                ModalModule.forRoot(),
                BootstrapModalModule,
                VexModalModule,
                DndModule.forRoot()
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });

        TestBed.overrideComponent(WorkflowComponent, {
            set: {
                providers: [
                    ContextMenuService,
                    {provide: CustomModalVexComponent,  useValue: customModalVexComponent},
                    {provide: WorkflowRunService, useValue: workflowRunService},
                    {provide: UserStoreService, useValue: userStoreService},
                    {provide: Auth, useValue: authService},
                    {provide: ActivatedRoute, useValue: mockActivatedRoute},
                    {provide: Router, useValue: router},
                    {provide: FlowchartComponent, useValue: flowChartComponent},
                    {provide: WorkflowService, useValue: workflowService},
                    {provide: OperatorsService, useValue: operatorsService},
                    {provide: ProjectsService, useValue: projectsService},
                    ValidationService,
                    {provide: UtilService, useValue: utilService},
                ]
            }
        });

        // create component and test fixture
        fixture = TestBed.createComponent(WorkflowComponent);

        // get test component from the fixture
        comp = fixture.debugElement.componentInstance;

        comp.selectedProjectId = 0;
        comp.operatorConfig = { 'helloWorld': 0, 'loadDataset': 1, 'exportCSV': 2};

    });

    it('should create an instance', async(() => {
        comp.getProject = jasmine.createSpy('getProject spy');
        comp.initWorkflow = jasmine.createSpy('initWorkflow spy');

        comp.ngOnInit();

        expect(comp).toBeTruthy();
        expect(comp.getProject).toHaveBeenCalled();
        expect(comp.initWorkflow).toHaveBeenCalled();
    }));

    it('should redirect to results', async(() => {
        comp.workflowRuns = mockWorkflowRuns;
        comp.redirectToResults();
        expect(comp.workflowRuns.length).toBeGreaterThan(0);
    }));

    it('should not redirect to results page', async(() => {
        comp.redirectToResults();
        let _len = comp.alertData.length;
        expect(_len).toBeGreaterThan(0);
    }));

    it('should get workflow of given project', async(() => {
        workflowService.getWorkflow.and.returnValue(new Promise((resolve, reject) => {
            let id = 0;
            if (id == 0) {
                resolve({"data":{"nodes":[{"metadata":{"yloc":"92","xloc":"234"},"config":{"path":"/datasets/prepared_dataset_test.csv"},"id":"task_1481114718817","operator_id":2,"name":"Load Dataset","type":"","class":"fa fa-upload padR5"},{"metadata":{"yloc":"162","xloc":"555"},"config":{"dataset_name":"Test Prepare dataset","overwrite":"true"},"id":"task_1481114720041","operator_id":3,"name":"Export CSV","type":"","class":"fa fa-download padR5"},{"metadata":{"yloc":"249","xloc":"213"},"config":{"path":"/projects/hello-world-1481115994784.txt"},"id":"task_1481114755763","operator_id":1,"name":"Hello World","type":"","class":"fa fa-globe padR5"},{"metadata":{"yloc":"273","xloc":"448"},"config":{"path":"/datasets/Modified.csv"},"id":"task_1481114768681","operator_id":2,"name":"Load Dataset","type":"","class":"fa fa-upload padR5"},{"metadata":{"yloc":"307","xloc":"683"},"config":{"dataset_name":"Test Modified","overwrite":"true"},"id":"task_1481114771275","operator_id":3,"name":"Export CSV","type":"","class":"fa fa-download padR5"}],"connections":[{"source":"task_1481114718817","target":"task_1481114720041"},{"source":"task_1481114768681","target":"task_1481114771275"}]}});
            } else {
                reject({});
            }
        }));

        comp.initWorkflow = jasmine.createSpy('initWorkflow');
        comp.getWorkflow(comp.selectedProjectId);

        setTimeout(function () {
            expect(workflowService.getWorkflow).toHaveBeenCalledWith(comp.selectedProjectId);
            expect(comp.initWorkflow).toHaveBeenCalled();
        },  1000);
    }));

    it('should initiate workflow', async(()=> {
        let data = { nodes: [{
            id: 1,
            operator_id: 2,
            name: 'hello world',
            type: 'HELLO WORLD',
            children: null,
            class: 'fa fa-plus',
            state: true,
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        }],
        connections: [{source: 1, target: 1}]};

        comp.flowControlNodes.push(new Node(data['nodes'][0]['id'], data['nodes'][0]['type'], data['nodes'][0]['name'], data['nodes'][0]['class'], true, [], data['nodes'][0]['operator_id'], data['nodes'][0]['metadata'], true, {}));
        comp.addNode = jasmine.createSpy('addNode spy');
        comp.validateNodeData = jasmine.createSpy('validateNodeData spy');
        comp.initWorkflow(data);
        setTimeout(function () {
            expect(comp.addNode).toHaveBeenCalled();
            expect(comp.validateNodeData).toHaveBeenCalled();
        });
    }));

    it('should initiate flowchart', async(()=> {
        comp.ngAfterViewInit();
        setTimeout(function () {
            expect(comp.state).toBeTruthy();
        }, 1000);
    }));

    it('should get list of operators', async(() => {
        operatorsService.getOperators.and.returnValue(new Promise((resolve, reject) => {
            let id = 0;
            if (id == 0) {
                resolve({"data": []});
            } else {
                reject({});
            }
        }));
        comp.getOperators();

        setTimeout(function () {
            expect(operatorsService.getOperators).toHaveBeenCalled();
            expect(comp.operators.length).toBe(0);
        }, 1000);
    }));

    it('should get the project', async(() => {
        let self = comp;
        projectsService.getProject.and.returnValue(new Promise((resolve, reject) => {
            let id = 0;
            if (id == 0) {
                resolve({"data":{"id":21,"name":"MyTestProject","description":"","status":"1","created_by":"Admin","created_date":"1481114595967","modified_by":"Admin","modified_date":"1481114595967","user_id":"1"}});
            } else {
                reject({});
            }
        }));
        self.getProject(comp.selectedProjectId);

        setTimeout(function () {
            expect(projectsService.getProject).toHaveBeenCalledWith(comp.selectedProjectId);
            expect(self.project['id']).toBe(21);
        }, 1000);
    }));

    it('should add node to the nodes list', async(()=> {
        let _node = {
            id: 'Dataset Actions',
            type: 'parent',
            name: 'Create Dataset',
            iconClass: 'fa-caret-down',
            state: true,
            operator_id: null,
            error: false,
            metadata: {xloc: '0', yloc: '0'},
            config: {},
            children: [
                {
                    id: 1,
                    type: 'child',
                    name: 'Hello World',
                    iconClass: 'icon-operator ic-helloworld',
                    state: true
                }
            ]
        };

        let _oldLen = comp.flowControlNodes.length;
        comp.addNode(_node);

        setTimeout(function () {
            let _newLen = comp.flowControlNodes.length;
            expect(_oldLen).not.toBe(_newLen);
        }, 500);
    }));

    it('should save workflow', async(() => {
        let self = comp;
        workflowService.updateWorkflow.and.returnValue(new Promise((resolve, reject) => {
            let id = 0;
            if (id == 0) {
                resolve({"data": []});
            } else {
                reject({});
            }
        }));
        self.saveWorkflow();

        setTimeout(function () {
            expect(workflowService.updateWorkflow).toHaveBeenCalled();
            expect(self.alertData.length).toBeGreaterThan(0);
            expect(comp.alertData[0].alertType).toBe(1);
        }, 1000);
    }));

    it('should delete workflow', async(()=> {
        let len = comp.workflowRuns.length;
        comp.deleteWorkflow();

        setTimeout(function () {
            expect(workflowService.deleteWorkflow).toHaveBeenCalled();
            expect(comp.workflowRuns.length).toBe(len);
        }, 1000);
    }));

    it('should empty alertData array', async(() => {
        let self = comp;
        self.onNotify('should empty alertData array');

        setTimeout(function () {
            let _len = self.alertData.length;
            expect(_len).toBe(0);
        }, 1000);
    }));

    it('should display a alert message', async(() => {
        let self = comp;
        self.createAlert('success', 1);
        expect(self.alertData.length).toBeGreaterThan(0);
    }));

    it('should display no operators alert', async(() => {
        comp.showOperatorsAlert();
        setTimeout(function () {
            expect(comp.alertData[0].alertType).toBe(2);
        }, 500);
    }));

    it('should toggle operators panel observable', async(() => {
        comp.operatorsPanelShown = true;
        comp.toggleOperatorsPanel();
        expect(comp.operatorsPanelShown).toBeFalsy();
    }));

    it('should expand operators tree', async(() => {
        comp.operators.push({
            id: 'Dataset Actions',
            type: 'parent',
            name: 'Create Dataset',
            iconClass: 'fa-caret-right',
            state: false,
            operator_id: null,
            error: false,
            config: {},
            metadata: {x: '0', y: '0'},
            children: []
        });

        comp.expandAll();
        expect(comp.operators[0]['state']).toBeTruthy();
        expect(comp.operators[0]['iconClass']).toEqual('fa-caret-down');
    }));

    it('should collapse operators tree', async(() => {
        comp.operators.push({
            id: 'Dataset Actions',
            type: 'parent',
            name: 'Create Dataset',
            iconClass: 'fa-caret-down',
            state: true,
            error: false,
            config: {},
            metadata: {x: '0', y: '0'},
            operator_id: null,
            children: []
        });

        comp.collapseAll();
        expect(comp.operators[0]['state']).toBeFalsy();
        expect(comp.operators[0]['iconClass']).toEqual('fa-caret-right');
    }));

    it('should get empty connections list', async(() => {
        let workflow_graph = comp.getAllConnections();
        setTimeout(function(){
            expect(workflow_graph['graph']['data']['nodes'].length).toEqual(0);
            expect(workflow_graph['graph']['data']['connections'].length).toEqual(0);
        },2000);
    }));

    it('should get a single node is nodes array', async(() => {
        let newNode = {
            id: 1,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };

        comp.flowControlNodes.push(new Node("task_123", newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], true, newNode['config']));
        flowChartComponent.getConnections.and.returnValue([{sourceId: 1, targetId: 2}]);

        let workflow_graph = comp.getAllConnections();
        setTimeout(function(){
            expect(workflow_graph['graph']['data']['nodes'].length).toEqual(1);
            expect(workflow_graph['graph']['data']['connections'].length).toEqual(1);
            expect(workflow_graph['error']).toBeTruthy();
        },2000);
    }));

    it('should display project name duplication message', async(() => {

        comp.createWorkflowRunFailure('409');
        expect(comp.errorMessage).toContain('Project name already exists');
        expect(comp.workflowRunNameError).toBeTruthy();
    }));

    it('should display project name duplication message', async(() => {

        comp.createWorkflowRunFailure('400');
        expect(comp.errorMessage).toContain('Unable to process your request. Please try later');
        expect(comp.workflowRunNameError).toBeTruthy();
    }));

    it('should display error for a invalid workflow run name', async(() => {
        comp.workflowRunName = "#@#$@";
        comp.validateWorkflowRunName();
        expect(comp.workflowRunNameError).toBeTruthy();
    }));

    it('should display error for a invalid workflow run name', async(() => {
        comp.workflowRunName = "Te";
        comp.validateWorkflowRunName();
        expect(comp.workflowRunNameError).toBeTruthy();
    }));

    it('should clear error message for a valid workflow run name', async(() => {
        comp.workflowRunName = "Test Workflow Name";
        comp.validateWorkflowRunName();
        expect(comp.workflowRunNameError).toBeFalsy();
    }));

    // ===================
    // #onSelectedFile() =
    // ===================
    it('should get the selected file', async(()=> {
        let _node = {id: 11, name: 'test.txt', type: 'FILE', children: null, state: true}
        let self = comp;
        self.onSelectedFile(_node);
        setTimeout(function () {
            expect(self.selectedFile.name).toBe('test.txt');
        }, 1000);
    }));

    // ===============
    // #onSelected() =
    // ===============
    it('should get the selected node', async(()=> {
        let _node = {name: "folder_rename_test", type: "DIRECTORY", children: [], path: [], id: 7}
        let self = comp;
        self.onSelected(_node);
        setTimeout(function () {
            expect(self.selectedFolder.name).toBe("folder_rename_test");
        }, 1000);
    }));

    it('should get the selected node', async(()=> {
        let _node = {name: "folder_rename_test", type: "DIRECTORY", children: [], path: [], id: 7}
        let self = comp;
        self.onSelected(_node);
        setTimeout(function () {
            expect(self.selectedFile.name).toBe('');
        }, 1000);
    }));

    it('should validate hello world operator error to false', async(()=> {
        let node = {
        };
        let connections = {};
        let error = comp.validateNodeData(0, node, connections);
        expect(error).toBeFalsy();
    }));

    it('should validate load dataset operator error to false', async(()=> {
        let node = {
            selectedFile: { id:  1},
            selectedFolder: {id : 2}
        };

        let connections = {};
        let error = comp.validateNodeData(1, node, connections);
        expect(error).toBeFalsy();
    }));

    it('should validate load dataset operator error to true when config is undefined', async(()=> {
        let node = {

        };

        let connections = {};
        comp.initSelectedFileFolder = jasmine.createSpy('initSelectedFileFolder');
        let error = comp.validateNodeData(1, node, connections);
        expect(error).toBeTruthy();
        expect(node['config']['path']).toBe('');
        expect(comp.initSelectedFileFolder).toHaveBeenCalled();
    }));


    it('should validate load dataset operator error to true when config path is undefined', async(()=> {
        let node = {
            config: {

            }
        };

        let connections = {};
        comp.initSelectedFileFolder = jasmine.createSpy('initSelectedFileFolder');
        let error = comp.validateNodeData(1, node, connections);
        expect(error).toBeTruthy();
        expect(node['config']['path']).toBe('');
        expect(comp.initSelectedFileFolder).toHaveBeenCalled();
    }));

    it('should validate load dataset operator error to false when config path is defined', async(()=> {
        let node = {
            config: {
                path: "lvuser/test.csv"
            }
        };

        let connections = {};

        utilService.getSelectedFileAndNode.and.returnValue({
            selectedFile: {id : 1},
            selectedFolder: {id: 2}
        });

        let error = comp.validateNodeData(1, node, connections);
        expect(error).toBeFalsy();
        expect(utilService.getSelectedFileAndNode).toHaveBeenCalled();
        expect(comp.selectedFile['id']).toBe(1);
        expect(comp.selectedFolder['id']).toBe(2);
    }));

    it('should validate export csv operator error to false when exportCSV is defined', async(()=> {
        let node = {
            exportCSVForm: comp.formbuilder.group({
                datasetName: [''],
                overwrite: true
            })
        };

        let connections = {};
        comp.getPrevNode = jasmine.createSpy('prevNode').and.returnValue({operator_id: 1});
        let error = comp.validateNodeData(2, node, connections);
        expect(error).toBeFalsy();
    }));

    it('should validate export csv operator error to true when config is undefined', async(()=> {
        let node = {
        };

        let connections = {};
        comp.getPrevNode = jasmine.createSpy('prevNode');
        comp.initExportCSVForm = jasmine.createSpy('initExportCSVForm');
        comp.getPrevNode = jasmine.createSpy('prevNode').and.returnValue({operator_id: 1});
        let error = comp.validateNodeData(2, node, connections);
        expect(error).toBeTruthy();
        expect(node['config']['dataset_name']).toBe('');
        expect(node['config']['overwrite']).toBe("false");
        expect(comp.initExportCSVForm).toHaveBeenCalled();
    }));

    it('should validate export csv operator error to true when config datset name is undefined', async(()=> {
        let node = {
            config: {

            }
        };

        let connections = {};

        comp.getPrevNode = jasmine.createSpy('prevNode');
        comp.initExportCSVForm = jasmine.createSpy('initExportCSVForm');
        comp.getPrevNode = jasmine.createSpy('prevNode').and.returnValue({operator_id: 1});
        let error = comp.validateNodeData(2, node, connections);
        expect(error).toBeTruthy();
        expect(node['config']['dataset_name']).toBe('');
        expect(node['config']['overwrite']).toBe("false");
        expect(comp.initExportCSVForm).toHaveBeenCalled();
    }));

    it('should validate export csv operator error to false when config datset name is defined', async(()=> {
        let node = {
            config: {
                dataset_name: 'Test dataset',
                overwrite: 'true'
            }
        };

        let connections = {};

        comp.getPrevNode = jasmine.createSpy('prevNode').and.returnValue({operator_id: 1});
        let error = comp.validateNodeData(2, node, connections);
        expect(error).toBeFalsy();
        expect(node['config']['dataset_name']).toBe('Test dataset');
        expect(node['config']['overwrite']).toBe("true");
    }));

    it('should load node data on modal', async(()=> {
        let node = {
            id: 11,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            state: true,
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ]
        };
        comp.loadNodeModalData(node);
        setTimeout(function () {
            expect(comp.currentNode.id).toBe(11);
        }, 1000);
    }));

    // ================================
    // #validateLoadDatasetMetadata() =
    // ================================
    it('should validate load dataset metadata', async(()=> {
        comp.selectedFile = {
            id: 14,
            name: "prepared_data_22216.csv",
            path: [
                {name: "lvuser", type: "DIRECTORY"},
                {name: "datasets", type: "DIRECTORY"},
                {name: "prepared_data_22216.csv", type: "FILE"}
            ],
            state: true,
            type: "FILE"
        };

        let node = {
            id: 11,
            operator_id: 1,
            name: 'Load Dataset',
            children: [],
            state: true,
            config: {
                'path': ''
            },
            error: true
        };

        comp.validateNodeData = jasmine.createSpy('validateNodeData');
        comp.initSelectedFileFolder = jasmine.createSpy('initSelectedFileFolder');
        comp.updateLoadDatasetMetadata(node);
        setTimeout(function () {
            expect(node.error).toBeFalsy();
            expect(comp.validateNodeData).toHaveBeenCalled();
            expect(comp.initSelectedFileFolder).toHaveBeenCalled();
        }, 1000);
    }));

    // ======================
    // #validateExportCSV() =
    // ======================
    it('should validate export csv data', async(()=> {
        comp.exportCSVForm.value.datasetName = 'Sample_CSV';
        comp.exportCSVForm.value.overwrite = true;
        let node = {
            id: 11,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };
        comp.updateExportCSVNode(node);
        setTimeout(function () {
            expect(node.config['dataset_name']).toBe('Sample_CSV');
            expect(node.config['overwrite']).toBeTruthy();
        }, 1000);
    }));

    it('should validate export csv data', async(()=> {
        comp.exportCSVForm.value.datasetName = 'Sample_CSV';
        comp.exportCSVForm.value.overwrite = false;
        let node = {
            id: 11,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            state: true,
            config: {
                path: ''
            },
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };
        comp.updateExportCSVNode(node);
        setTimeout(function () {
            expect(node.config['dataset_name']).toBe('Sample_CSV');
            expect(node.config['overwrite']).toBe("false");
        }, 1000);
    }));

    it('should validate load data set metadata', async(()=> {
        let dialogRef = jasmine.createSpyObj('dialogRef', ['close']);

        comp.selectedFile = {
            id: 14,
            name: "prepared_data_22216.csv",
            path: [
                {name: "lvuser", type: "DIRECTORY"},
                {name: "datasets", type: "DIRECTORY"},
                {name: "prepared_data_22216.csv", type: "FILE"}
            ],
            state: true,
            type: "FILE"
        };

        let node = {
            id: 11,
            operator_id: 1,
            name: 'Load Dataset',
            children: [],
            state: true,
            config: {
                'path': ''
            },
            error: true
        };

        comp.validateNodeData = jasmine.createSpy('validateNodeData');
        comp.initSelectedFileFolder = jasmine.createSpy('initSelectedFileFolder');
        comp.updateNode(dialogRef, node);
        setTimeout(function () {
            expect(node.error).toBeFalsy();
            expect(comp.validateNodeData).toHaveBeenCalled();
            expect(comp.initSelectedFileFolder).toHaveBeenCalled();
        }, 1000);
    }));

    it('should validate export csv data', async(()=> {
        let dialogRef = jasmine.createSpyObj('dialogRef', ['close']);
        comp.exportCSVForm.value.datasetName = 'Sample_CSV';
        comp.exportCSVForm.value.overwrite = true;
        let node = {
            id: 11,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };
        comp.updateNode(dialogRef, node);
        setTimeout(function () {
            expect(node.config['dataset_name']).toBe('Sample_CSV');
            expect(node.config['overwrite']).toBeTruthy();
        }, 1000);
    }));

    it('should call validation of connections', async(()=> {
        let info = {id: 1};

        comp.validateSourceTargetNode = jasmine.createSpy("validateSourceTargetNode spy");
        comp.connection(info);

        expect(comp.validateSourceTargetNode).toHaveBeenCalledWith(info);
    }));

    it('should show delete connection modal', async(()=> {
        let conn = {};
        comp.showDeleteConnectionModal(conn);

        expect(comp.conn).toEqual(conn);
    }));

    it('should clear workflow nodes', async(()=> {
        comp.deleteNode = jasmine.createSpy("deleteNode spy");

        let newNode = {
            id: 11,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };

        comp.flowControlNodes.push(new Node("task_123", newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], false, newNode['config']));
        comp.clearWorkflow();

        expect(comp.deleteNode).toHaveBeenCalledWith("task_123");

    }));

    it('should validate source and target nodes', async(()=> {
        let conn = {
            sourceId: 1,
            targetId: 2
        }
        comp.getNode = jasmine.createSpy("getNode spy").and.returnValue({operator_id: 1});
        comp.validateNodeData = jasmine.createSpy("validateNodeData spy")
        comp.validateSourceTargetNode(conn);

        expect(comp.getNode).toHaveBeenCalled();
        expect(comp.validateNodeData).toHaveBeenCalled();
    }));

    it('should validate nodes before the connection is made', async(()=> {
        let conn = {
            sourceId: 1,
            targetId: 2
        };

        let info = {
            targetId: 1
        }

        flowChartComponent.getConnections.and.returnValue([conn]);

        let state = comp.beforeDrop(info);

        expect(state).toBeFalsy();
    }));

    it('should validate nodes before the connection is made', async(()=> {
        let conn = {
            sourceId: 1,
            targetId: 2
        };

        let info = {
            targetId: 2
        }

        flowChartComponent.getConnections.and.returnValue([conn]);

        let state = comp.beforeDrop(info);

        expect(state).toBeTruthy();
    }));

    it('should validate nodes before detachment of connection', async(()=> {
        let conn = {
            sourceId: 1,
            targetId: 2
        };


        comp.validateSourceTargetNode = jasmine.createSpy('validateSourceTargetNode spy');
        let info = {
            targetId: 1
        }
        let state = comp.detach(conn);

        expect(comp.validateSourceTargetNode).toHaveBeenCalledWith(conn);
    }));

    it('should delete node from flow control nodes', async(()=> {

        let newNode = {
            id: 1,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };

        comp.flowControlNodes.push(new Node("task_123", newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], false, newNode['config']));
        comp.validateSourceTargetNode = jasmine.createSpy('validateSourceTargetNode');
        let state = comp.deleteNode('task_123');

        expect(comp.flowControlNodes.length).toEqual(0);
        expect(comp.validateSourceTargetNode).toHaveBeenCalled();
    }));

    it('should add node to the graph', async(()=> {
        let event = { dragData: {
            id: 1,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        },
        mouseEvent: {
            offsetX: 0,
            offsetY: 0
        }};

        comp.addNode = jasmine.createSpy('addNode spy').and.returnValue(event);
        comp.initNodes = jasmine.createSpy('initNodes spy');
        let state = comp.addToGraph(event);

        setTimeout(function () {
            expect(comp.addNode).toHaveBeenCalled();
            expect(comp.initNodes).toHaveBeenCalled();
        }, 1000);

    }));

    it('should validate the workflow nodes when there is an error', async(()=> {
        comp.getAllConnections = jasmine.createSpy('getAllConnections spy').and.returnValue({error: true});
        comp.createAlert = jasmine.createSpy('createAlert spy');
        let state = comp.validateWorkflowNodes();

        setTimeout(function () {
            expect(comp.createAlert).toHaveBeenCalled();
        }, 1000);

    }));

    it('should validate the workflow nodes when there are no errors', async(()=> {
        comp.getAllConnections = jasmine.createSpy('getAllConnections spy').and.returnValue({error: false});
        comp.showConfigModal = jasmine.createSpy('showConfigModal spy');
        let state = comp.validateWorkflowNodes();

        setTimeout(function () {
            expect(comp.showConfigModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should populate default workflow run name', async(()=> {
        comp.workflowRuns = [];
        comp.project = {name: 'Project 1'};

        let state = comp.setWorkflowRunName();
        setTimeout(function () {
            expect(comp.workflowRunName).toEqual('Project 1 - Run 1');
        }, 1000);

    }));

    it('should populate default workflow run name when there are workflow runs present', async(()=> {
        comp.workflowRuns = [{ id: 1}];
        comp.project = {name: 'Project 1'};

        let state = comp.setWorkflowRunName();
        setTimeout(function () {
            expect(comp.workflowRunName).toEqual('Project 1 - Run 2');
        }, 1000);

    }));

    it('should get the select node information', async(()=> {
        let newNode = {
            id: 1,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        };

        comp.flowControlNodes.push(new Node("task_123", newNode.type, newNode.name, newNode.iconClass, true, [], newNode.id, newNode['metadata'], false, newNode['config']));
        let node = comp.getNode('task_123');

        expect(node).toEqual(comp.flowControlNodes[0]);
    }));

    it('should initialize repository folder path list', async(()=> {
        let repoList = {
            id: 1,
            name: 'lvuser',
            type: 'DIRECTORY',
            children: null,
            state: true,
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ]
        };

        comp.setRepoList(repoList);

        expect(comp.availableFileNodes).toEqual(repoList);
        expect(comp.selectedFolder).toEqual(repoList);
    }));

    it('should call success alert function when workflow runs successfully', async(()=> {
        let dialogRef = jasmine.createSpyObj('dialogRef', ['close']);

        comp.closeModal = jasmine.createSpy('closeModal spy');
        comp.createAlert = jasmine.createSpy('createAlert spy');
        comp.createWorkflowRunSuccess(dialogRef);
        expect(comp.closeModal).toHaveBeenCalled();
        expect(comp.createAlert).toHaveBeenCalled();
    }));

    it('should close modal popup', async(()=> {
        let dialogRef = {
            close : jasmine.createSpy('closeModal spy')
        }

        comp.closeModal('createRun', dialogRef);
        expect(comp.workflowRunNameError).toBeFalsy();
        expect(comp.workflowRunName).toBe('');
        expect(comp.errorMessage).toBe('');
    }));

    it('should trigger configure of node information', async(()=> {
        let node = {};

        comp.showConfigModal = jasmine.createSpy('showConfigModal spy');
        comp.loadNodeModalData = jasmine.createSpy('loadNodeModalData spy');
        comp.bodyClick = jasmine.createSpy('bodyClick spy');

        comp.configureNode(node);
        expect(comp.showConfigModal).toHaveBeenCalledWith(node);
        expect(comp.loadNodeModalData).toHaveBeenCalledWith(node);
        expect(comp.bodyClick).toHaveBeenCalled();
    }));

    it('should select a particular folder', async(()=> {
        let folder = {id: 1, type: 'DIRECTORY'};
        let node = { selectedFile: {}};

        let emptyFileNode = {id: '', name: '', type: ''};

        comp.selectFolder(folder, node);

        expect(comp.selectedFolder).toEqual(folder);
        expect(node['selectedFile']).toEqual(emptyFileNode);
    }));

    it('should update the graph after the node members are loaded', async(()=> {
        comp.state = true;
        comp.flowControlNodes = [];
        comp.nodeMembersDone();

        setTimeout(function () {
            expect(flowChartComponent.updateGraph).toHaveBeenCalled();
        }, 1000);

    }));

    it('should run the workflow calling the worklowRunService', async(()=> {
        let dialogRef = jasmine.createSpyObj('dialogRef', ['close']);
        comp.getAllConnections = jasmine.createSpy('comp.getAllConnections spy').and.returnValue({
            error: false
        });
        comp.validateWorkflowRunName = jasmine.createSpy('comp.validateWorkflowRunName spy').and.returnValue(false);
        workflowRunService.createWorkflowRun.and.returnValue(new Promise((resolve, reject) => {
            let id = 0;
            if (id == 0) {
                resolve({"data": []});
            } else {
                reject({});
            }
        }));
        comp.createWorkflowRunSuccess = jasmine.createSpy('comp.createWorkflowRunSuccess spy');

        comp.runWorkflow(dialogRef);
        setTimeout(function () {
            expect(comp.getAllConnections).toHaveBeenCalled();
            expect(comp.validateWorkflowRunName).toHaveBeenCalled();
            expect(workflowRunService.createWorkflowRun).toHaveBeenCalled();
            expect(comp.createWorkflowRunSuccess).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create alert if there are invalid nodes while workflow is run', async(()=> {
        let dialogRef = jasmine.createSpyObj('dialogRef', ['close']);
        comp.getAllConnections = jasmine.createSpy('comp.getAllConnections spy').and.returnValue({
            error: true
        });
        comp.createAlert = jasmine.createSpy('comp.createAlert spy');
        comp.runWorkflow(dialogRef);
        setTimeout(function () {
            expect(comp.getAllConnections).toHaveBeenCalled();
            expect(comp.createAlert).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create default modal', async(()=> {
        comp.showConfigModal({name: 'test'});
        setTimeout(function () {
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create load dataset modal', async(()=> {
        comp.showConfigModal({name: 'Load Dataset'});
        setTimeout(function () {
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create exportCSV modal', async(()=> {
        comp.initSelectedFolder = jasmine.createSpy('initSelectedFolder spy');
        comp.showConfigModal({name: 'Export CSV'});
        setTimeout(function () {
            expect(comp.initSelectedFolder).toHaveBeenCalled();
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create Quick Summary modal', async(()=> {
        comp.showConfigModal({name: 'Quick Summary'});
        setTimeout(function () {
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create Clear Workflow modal', async(()=> {
        comp.showConfigModal({name: 'Clear Workflow'});
        setTimeout(function () {
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create Run Workflow modal', async(()=> {
        comp.setWorkflowRunName = jasmine.createSpy('setWorkflowRunName spy');
        comp.showConfigModal({name: 'Run Workflow'});
        setTimeout(function () {
            expect(comp.setWorkflowRunName).toHaveBeenCalled();
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should create Save Workflow modal', async(()=> {
        comp.showConfigModal({name: 'Save Workflow'});
        setTimeout(function () {
            expect(customModalVexComponent.createModal).toHaveBeenCalled();
        }, 1000);

    }));

    it('should get the previous node id', async(()=> {
        comp.getNode = jasmine.createSpy('getNode').and.returnValue({
            id: 2,
            operator_id: 2,
            name: 'test.txt',
            type: 'FILE',
            children: null,
            iconClass: 'fa fa-plus',
            state: true,
            config: {},
            path: [
                {name: "user1", type: "DIRECTORY"},
                {name: "My Docs", type: "DIRECTORY"},
                {name: "test.txt", type: "FILE"}
            ],
            metadata: {
                xloc: '0',
                yloc: '0'
            },
            error: true
        });
        let node = comp.getPrevNode(1, [{sourceId: 2, targetId: 1}]);
        setTimeout(function () {
            expect(comp.getNode).toHaveBeenCalledWith(2);
            expect(node['id']).toBe(2);
        }, 1000);

    }));

    it('should initialize hello world operator node', async(()=> {
        let node = {};
        let error = comp.initNodes(0, node);
        setTimeout(function () {
            expect(error).toBeFalsy();
        }, 1000);

    }));

    it('should initialize  load dataset operator node', async(()=> {
        let node = {};
        comp.initSelectedFileFolder = jasmine.createSpy('initSelectedFileFolder');
        let error = comp.initNodes(1, node);
        setTimeout(function () {
            expect(node['config']['path']).toBe('');
            expect(error).toBeTruthy();
        }, 1000);

    }));

    it('should initialize  load dataset operator node', async(()=> {
        let node = {};
        let error = comp.initNodes(2, node);
        setTimeout(function () {
            expect(node['config']['dataset_name']).toBe('');
            expect(node['config']['overwrite']).toBe('false');
            expect(error).toBeTruthy();
        }, 1000);

    }));
});
