import * as React from 'react';
import styles from './MindMapSRVComponent.module.scss';
import { IMindNode } from './Interfaces';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export interface IMindNodeComponentProps extends IMindNode {

    onDragStart(event: React.DragEvent<HTMLDivElement>, nodeID: string): void;
}

export interface IMindNodeComponentState { }

export class MindNodeComponent extends React.Component<IMindNodeComponentProps, IMindNodeComponentState> {

    constructor(props: IMindNodeComponentProps) {
        super(props);

        this.state = {

        };
    }

    public render(): React.ReactElement<IMindNodeComponentProps> {

        const { id, title, children, hasParent, position } = this.props;
        return (
            <div key={'p' + id} className={styles.node}
                style={this.getPosition()}
            >
                <div className={styles.nodecontent}
                >
                    <div className={'NodeToolbar'}>
                        <div
                            className={styles.darggableitem}
                            draggable
                            onDragStart={(e) => this.props.onDragStart(e, id)}
                        >
                            <IconButton iconProps={{ iconName: 'Move' }}
                                title="LOC Move" ariaLabel="LOC Move"

                            /></div>
                        <IconButton iconProps={{ iconName: 'Edit' }}
                            title="LOC Edit" ariaLabel="LOC Edit"
                        />
                        <IconButton
                            menuProps={{
                                items: [
                                    {
                                        key: 'add',
                                        text: 'add child',
                                        iconProps: { iconName: 'Add' },
                                    },
                                    {
                                        key: 'unlink',
                                        text: 'unlink',
                                        iconProps: { iconName: 'RemoveLink' },
                                    },
                                ],
                                directionalHintFixed: true,
                            }}
                            iconProps={{ iconName: 'MoreVertical' }}
                            title="LOC MoreActions"
                            ariaLabel="LOC MoreActions"

                        />
                    </div>
                    <div>{title}</div>

                </div>
                <div className={styles.children}>
                    {
                        children && children.map((x, i) => {
                            return (<MindNodeComponent {...x} key={'c' + x.id}
                                onDragStart={this.props.onDragStart}
                            />);
                        })
                    }
                </div>

                {
                    hasParent && (
                        <svg className={styles.line} style={
                            {
                                top: (position.y * -1) + 'px',
                                left: (position.x * -1) + 'px',
                                height: (position.y * 2) + 'px',
                                width: (position.x * 2) + 'px'
                            }
                        }
                        >
                            <line
                                x1={0}
                                y1={0}
                                x2={position.x}
                                y2={position.y} />
                        </svg>
                    )
                }
            </div >
        );
    }

    private getPosition(): any {
        const { position } = this.props;
        return ({
            top: position.y + 'px',
            left: position.x + 'px'
        })
    }

    /*
    var x1 = div1.offset().left + (div1.width() / 2);
    var y1 = div1.offset().top + (div1.height() / 2);
    var x2 = div2.offset().left + (div2.width() / 2);
    var y2 = div2.offset().top + (div2.height() / 2);
    */
    //  line.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);

    //Dragging with position offse
}
