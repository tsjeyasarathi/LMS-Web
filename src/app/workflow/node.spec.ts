/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Node } from './node';

describe('Class: Node', () => {
    it('create an instance', () => {
        let data = {
            id: 'Dataset Actions',
            type: 'parent',
            name: 'Create Dataset',
            iconClass: 'fa-caret-down',
            state: true,
            operator_id: null,
            error: true,
            metadata: {xloc: 0, yloc: 0},
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

        let node = new Node(data.id, data.type, data.name, data.iconClass, data.state, data.children, data.operator_id, data.metadata, data.error,  data.config);
        expect(node).toBeTruthy();
    });
});
