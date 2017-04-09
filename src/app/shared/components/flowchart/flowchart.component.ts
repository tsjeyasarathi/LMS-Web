import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

declare let jsPlumb:any;
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
  providers: []
})
export class FlowchartComponent {

  public endpoints:any;
  public instance: any;

  @ViewChild('confirmConnectionDeleteModal') confirmConnectionDeleteModal:TemplateRef<any>;

  constructor() {
    this.endpoints = {};
  }

  public getInstance(options) {
    this.instance = jsPlumb.getInstance(options);
    return this.instance;
  }

  private initEndpoints(selector) {
    jsPlumb.ready(() => {
      let primaryColor = '#33b5e5',
          connector = ["Flowchart", {cssClass: "connectorClass", hoverClass: "connectorHoverClass"}],
          connectorStyle = {
            gradient: {
              stops: [
                [0, primaryColor],
                //[0.5, '#33b5e5'],
                [1, primaryColor]
              ]
            },
            strokeWidth: 2,
            stroke: primaryColor
          },
          hoverStyle = {
            stroke: "#449999"
          },
          overlays = [
            ["Arrow", {fill: "#33b5e5", width: 10, length: 10}]
          ],
          endpoint = ["Dot", {cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass"}],
          sourcePointStyle = {fill: primaryColor},
          targetPointStyle = { fill: "#fefefe", outlineStroke: primaryColor, outlineWidth:5 },
          sourceAnchors = [
            [1, 0.5, 1, 0, 0.3, 0, "bar"]
          ],
          targetAnchors = [
            [1, 0.7, 1, 0]
          ],
          sourceEndpoint = {
            endpoint: endpoint,
            paintStyle: sourcePointStyle,
            hoverPaintStyle: {fill: "#449999"},
            isSource: true,
            isTarget: true,
            maxConnections: 5,
            connector: connector,
            connectorStyle: connectorStyle,
            connectorHoverStyle: hoverStyle,
            connectorOverlays: overlays
          },
          targetEndpoint = {
            endpoint: endpoint,
            paintStyle: targetPointStyle,
            hoverPaintStyle: {fill: "#449999"},
            isSource: true,
            isTarget: true,
            maxConnections: 5,
            connector: connector,
            connectorStyle: connectorStyle,
            connectorHoverStyle: hoverStyle,
            connectorOverlays: overlays
          };

      let instance = this.instance;
      let divsWithWindowClass = jsPlumb.getSelector(selector);

      for (let i = 0; i < divsWithWindowClass.length; i++) {
        let id = instance.getId(divsWithWindowClass[i]);
        this.endpoints[id] = [
          instance.addEndpoint(id, sourceEndpoint, {anchor: sourceAnchors})
        ];
      }
      instance.draggable(divsWithWindowClass);
    });
  }

  public initGraph(selector, connections, click_cb, before_drop_cb, connection_cb) {
    jsPlumb.ready(() => {

      this.initEndpoints(selector);
      let endpoints = this.endpoints;
      let instance = this.instance;
      for (let e in endpoints) {
        if (connections[e]) {
          for (let j = 0; j < connections[e].length; j++) {
            instance.connect({
              source: endpoints[e][0],
              target: endpoints[connections[e][j]][0]
            });
          }
        }
      }

      instance.bind("click", function (conn) {
        click_cb(conn);
      });

      instance.bind("beforeDrop", function (info) {
        return before_drop_cb(info);
      });

      instance.bind("connection", function (info) {
        return connection_cb(info);
      });
    });
  }

  public detach(conn) {
    this.instance.detach(conn);
    return conn;
  }

  public updateGraph(selector) {
    jsPlumb.ready(() => {
      this.initEndpoints(selector);
    });
    return true;
  }

  public getEndpoints() {
    return this.endpoints;
  }

  public getConnections() {
    return this.instance.getConnections();
  }

  public deleteNode(id) {
    let instance = this.instance;
    let endpoints = this.endpoints;
    let connectionList = instance.getConnections();

    let conn = {};
    for (let i in connectionList) {
      if (connectionList[i]["sourceId"] == id || connectionList[i]["targetId"] == id) {
        conn = connectionList[i];
        instance.detach(connectionList[i]);
      }
    }

    if (endpoints[id] != undefined) {
      instance.deleteEndpoint(endpoints[id][0]);
      instance.remove(endpoints[id][0]);
      instance.deleteEndpoint(endpoints[id][1]);
      instance.remove(endpoints[id][1]);
    }

    for (let i in this.endpoints) {
      if (i == id) {
        delete this.endpoints[i];
        break;
      }
    }
    return conn;
  }
}
