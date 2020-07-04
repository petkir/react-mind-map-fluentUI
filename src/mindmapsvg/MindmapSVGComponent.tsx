import * as React from 'react';
import styles from './MindMapSRVComponent.module.scss';

import { IMindNode } from './Interfaces';
import { MindNodeComponent } from './MindNodeComponent';
import { cloneDeep } from '@microsoft/sp-lodash-subset';


export interface IMindMapSRVComponentProps { }

export interface IMindMapSRVComponentState {
    model?: IMindNode[];

}

export default class MindMapSRVComponent extends React.Component<IMindMapSRVComponentProps, IMindMapSRVComponentState> {
    // private board= React.useRef(); i will try without it
    constructor(props: IMindMapSRVComponentProps) {
        super(props);


        this.state = {
            model: [
                {
                    id: 'N1', title: 'Node1',
                    position: { x: 10, y: 10 },
                    children: [
                        {
                            id: 'N11', title: 'Node11',
                            position: { x: 60, y: 80 },
                            hasParent: true
                        }, {
                            id: 'N12', title: 'Node12',
                            position: { x: 60, y: 180 },
                            hasParent: true
                        }, {
                            id: 'N13', title: 'Node13',
                            position: { x: 60, y: 280 },
                            hasParent: true,
                            children: [
                                {
                                    id: 'N131', title: 'Node131',
                                    position: { x: 160, y: 80 },
                                    hasParent: true
                                },
                                {
                                    id: 'N132', title: 'Node132',
                                    position: { x: 160, y: 180 },
                                    hasParent: true
                                }
                            ]
                        }
                    ]
                }
            ]

        };
    }

    public render(): React.ReactElement<IMindMapSRVComponentProps> {
        if (this.state.model && this.state.model.length > 0) {
            return (
                <div className={styles.board} style={this.findMinHeight()}

                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop.bind(this)}
                    onDragEnd={this.onDragEnd.bind(this)}
                >
                    {this.state.model.map((x, i) => {
                        return (
                            <MindNodeComponent {...x} key={'c' + x.id}
                                onDragStart={this.onDragStart.bind(this)}
                            />

                        );
                    })
                    }
                </div>
            );
        }
        return (<div>
            Create first a node
        </div>);
    }
    private findMinHeight(): any {

        return ({
            minHeight: 300 + 'px'
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
        const nextmodel = cloneDeep(this.state.model);
        const item = this.findNodeInModel(nextmodel, nodeId);

        console.log(event.nativeEvent);
        console.log(event.nativeEvent.offsetX);
        console.log(event.nativeEvent.offsetY);
        debugger;
        //item.position.x = item.position.x + event.nativeEvent.offsetX;
        //item.position.y = item.position.y + event.nativeEvent.offsetY;
        item.position.x =  event.nativeEvent.offsetX;
        item.position.y =  event.nativeEvent.offsetY;



        this.setState({ model: nextmodel });
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
}
