export class Node {
    id: string;
    type: string;
    name: string;
    iconClass: string;
    state: boolean;
    children: any[];
    operator_id: any;
    error: boolean;
    metadata: any;
    config = {};
    duration: string;

    constructor(id, type, name, iconClass, state, children, operator_id, metadata, error, config, duration) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.iconClass = iconClass;
        this.state = state;
        this.children = children;
        this.operator_id = operator_id;
        this.error = error;
        this.metadata = metadata;
        this.metadata.xloc = metadata.xloc;
        this.metadata.yloc = metadata.yloc;
        this.config = config;
        this.duration = duration;
    }
}
