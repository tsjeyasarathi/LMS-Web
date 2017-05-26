import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WorkflowService } from '../shared/services/workflow.service';

@Injectable()
export class WorkflowResolver implements Resolve<any> {
    constructor(public workflowService:WorkflowService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any>{
        return this.workflowService.getWorkflow(route.params['project_id']);
    }
}