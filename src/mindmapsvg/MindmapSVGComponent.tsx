import * as React from 'react';
import styles from './MindMapSRVComponent.module.scss';


import { MindNodeComponent } from './Components/MindNodeComponent';
import { MindMapZoomComponent } from './Components/MindMapZoomComponent';
import { cloneDeep, findIndex } from '@microsoft/sp-lodash-subset';
import { IMindNode } from './Interfaces';


export interface IMindMapSRVComponentProps {
  model: IMindNode[];
  modelChanged: (model: IMindNode[]) => void;
}

export interface IMindMapSRVComponentState {
  zoomLevel: number;

}

export default class MindMapSRVComponent extends React.Component<IMindMapSRVComponentProps, IMindMapSRVComponentState> {
  // private board= React.useRef(); i will try without it
  constructor(props: IMindMapSRVComponentProps) {
    super(props);
    this.state = { zoomLevel: 100 }
    this.eventChildExpandCollaps = this.eventChildExpandCollaps.bind(this);
    this.eventAddChildNode = this.eventAddChildNode.bind(this);
    this.eventDeleteNode = this.eventDeleteNode.bind(this);
    this.eventUnlinkNode = this.eventUnlinkNode.bind(this);
    this.setZoomLevel = this.setZoomLevel.bind(this);
    this.expandAllNodes = this.expandAllNodes.bind(this);

  }

  public render(): React.ReactElement<IMindMapSRVComponentProps> {
    const { zoomLevel } = this.state;
    if (this.props.model && this.props.model.length > 0) {
      return (
        <div>
          <div className={styles.board}
            style={this.getHeightAndZoom()}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop.bind(this)}
            onDragEnd={this.onDragEnd.bind(this)}
          >
            {this.props.model.map((x, i) => {
              return (
                <MindNodeComponent {...x} key={'c' + x.id}
                  onDragStart={this.onDragStart.bind(this)}
                  eventChildExpandCollaps={this.eventChildExpandCollaps}
                  eventAddChildNode={this.eventAddChildNode}
                  eventDeleteNode={this.eventDeleteNode}
                  eventUnlinkNode={this.eventUnlinkNode}
                />

              );
            })
            }

          </div>
          <MindMapZoomComponent eventExpandAll={this.expandAllNodes} eventZoomLevelChanged={this.setZoomLevel} zoomLevel={zoomLevel} />
        </div>
      );
    }
    return (<div>
      Create first a node
    </div>);
  }
  private getHeightAndZoom(): React.CSSProperties {
    const { zoomLevel } = this.state;
    return ({
      minHeight: 300 + 'px',
      transform: `scale(${zoomLevel / 100})`,
    });
  }
  private onDragStart(event: React.DragEvent<HTMLDivElement>, nodeID: string) {
    event.dataTransfer.setData("Text", nodeID);
    console.log('setDataTransfer:' + nodeID);
    event.dataTransfer.effectAllowed = 'move';
    if (!event.currentTarget.classList.contains(styles.dragging)) {
      event.currentTarget.classList.add(styles.dragging);
    }
  }
  private onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    console.log(event.nativeEvent);
    console.log(event.nativeEvent.offsetX);
    console.log(event.nativeEvent.offsetY);
  }
  private onDrop(event: React.DragEvent<HTMLDivElement>) {
    const nodeId = event.dataTransfer.getData("Text");
    console.log('getDataTransfer:' + nodeId);
    //picking current position calclate offset and set ist to treenode
    const nextmodel = cloneDeep(this.props.model);
    const item = this.findNodeInModel(nextmodel, nodeId);

    console.log(event.nativeEvent);
    console.log(event.nativeEvent.offsetX);
    console.log(event.nativeEvent.offsetY);
    //item.position.x = item.position.x + event.nativeEvent.offsetX;
    //item.position.y = item.position.y + event.nativeEvent.offsetY;
    item.position.x = event.nativeEvent.offsetX;
    item.position.y = event.nativeEvent.offsetY;

    this.props.modelChanged(nextmodel);
    /*
    event.clientX
    event.clientY
    */
  }
  private onDragEnd(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget.classList.contains(styles.dragging)) {
      event.currentTarget.classList.remove(styles.dragging);
    }
  }
  private findNodeInModel(nodes: IMindNode[], id: string): IMindNode {
    if (!!nodes) {
      const filternodes = nodes.filter(n => n.id === id);
      if (filternodes.length > 0) {
        return filternodes[0];
      } else {
        for (let index = 0; index < nodes.length; index++) {
          if (!!nodes[index].children) {
            return this.findNodeInModel(nodes[index].children, id);
          }
        }
      }
    }
    return undefined;
  }
  private findParentNodeInModel(nodes: IMindNode[], id: string): IMindNode {
    if (!!nodes) {
      for (let index = 0; index < nodes.length; index++) {
        if (!!nodes[index].children) {
          const haschild = nodes[index].children.filter(p => p.id == id)
          if (haschild && haschild.length > 0) {
            return nodes[index];
          }
          return this.findParentNodeInModel(nodes[index].children, id);
        }
      }
    }
    return undefined;
  }

  private eventChildExpandCollaps(nodeId: string, expand: boolean): void {
    const nextmodel = cloneDeep(this.props.model);
    const item = this.findNodeInModel(nextmodel, nodeId);
    item.childsExpanded = expand;
    this.props.modelChanged(nextmodel);
  }
  private eventAddChildNode(nodeId: string): void {
    const nextmodel = cloneDeep(this.props.model);
    const item = this.findNodeInModel(nextmodel, nodeId);
    if (!item.children) { item.children = []; }
    item.childsExpanded = true;
    item.children.push({
      id: this.generateNodeId(),
      title: 'newtitle',
      hasParent: true,
      position: { x: 100, y: 80 }
    });
    this.props.modelChanged(nextmodel);
  }
  private eventDeleteNode(nodeId: string): void {
    const nextmodel = cloneDeep(this.props.model);
    const parentNode: IMindNode = this.findParentNodeInModel(nextmodel, nodeId);
    const index = findIndex(parentNode.children, (x) => x.id === nodeId);
    parentNode.children.splice(index, 1);
    this.props.modelChanged(nextmodel);
  }
  private eventUnlinkNode(nodeId: string): void {
    const nextmodel = cloneDeep(this.props.model);
    const item = this.findNodeInModel(nextmodel, nodeId);
    //save a copy
    const unlinkeditem = cloneDeep(item);
    //delete  from treee
    const parentNode: IMindNode = this.findParentNodeInModel(nextmodel, nodeId);
    const index = findIndex(parentNode.children, (x) => x.id === nodeId);
    parentNode.children.splice(index, 1);

    //TODO Position Recalculation
    unlinkeditem.hasParent= false;
    unlinkeditem.position = { x: 600, y: 50 };
    nextmodel.push(unlinkeditem);
    this.props.modelChanged(nextmodel);
  }

  private generateNodeId(): string {
    return '' + new Date().getUTCMilliseconds();
  }
  private setZoomLevel(value: number) {
    this.setState({ zoomLevel: value });
  }
  private expandAllNodes(expand: boolean): void {
    const nextmodel: IMindNode[] = cloneDeep(this.props.model);
    this.expandChilds(nextmodel, expand);
    this.props.modelChanged(nextmodel);
  }
  private expandChilds(nodes: IMindNode[], expand: boolean): void {
    if (!!nodes) {
      for (let index = 0; index < nodes.length; index++) {
        nodes[index].childsExpanded = expand;
        if (nodes[index].children && nodes[index].children.length > 0) {
          this.expandChilds(nodes[index].children, expand);
        }
      }
    }
  }
}
