import * as React from 'react';
import styles from './MindMapComponent.module.scss';

import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';

//Localication Text is marked wit LOC 

import { Diagram } from "@blink-mind/renderer-react";
import RichTextEditorPlugin from "@blink-mind/plugin-rich-text-editor";
import { JsonSerializerPlugin } from "@blink-mind/plugin-json-serializer";
import { ThemeSelectorPlugin } from "@blink-mind/plugin-theme-selector";
import TopologyDiagramPlugin from "@blink-mind/plugin-topology-diagram";
import { TopicReferencePlugin, SearchPlugin } from "@blink-mind/plugins";
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { generateSimpleModel } from './utils';

const plugins = [
    RichTextEditorPlugin(),
    ThemeSelectorPlugin(),
    TopicReferencePlugin(),
    SearchPlugin(),
    TopologyDiagramPlugin(),
    JsonSerializerPlugin()
];

export interface IMindMapComponentProps {
    allowCommandBarNew: boolean;
    allowCommandBarOpen: boolean;
    allowCommandBarDownload: boolean;
}

export interface IMindMapComponentState {
    model?: any;
}

export class MindMapComponent extends React.Component<IMindMapComponentProps, IMindMapComponentState> {
    private overflowProps: IButtonProps = { ariaLabel: 'LOC More commands' };
    private diagram;

    constructor(props: IMindMapComponentProps) {
        super(props);


        this._diagramRef = this._diagramRef.bind(this);
        this.onClickRedo = this.onClickRedo.bind(this);
        this.onClickUndo = this.onClickUndo.bind(this);

        this.initModel();
    }

    public render(): React.ReactElement<IMindMapComponentProps> {
        return (
            <div className={styles.mindmapwrapper}>
                <CommandBar
                    items={this._items()}
                    overflowItems={this._overflowItems()}
                    overflowButtonProps={this.overflowProps}
                    farItems={this._farItems()}
                    ariaLabel="LOC Use left and right arrow keys to navigate between commands"
                />
                <div className={styles.mindmap}>
                    {this.renderDiagram()}
                </div>
            </div>
        );
    }
    private renderDiagram() {
        return (
            <Diagram
                ref={this._diagramRef}
                model={this.state.model}
                onChange={this.onDiagramChange}
                plugins={plugins}
            />
        );
    }
    private initModel() {
        const model = generateSimpleModel();
        this.state = { model };
    }
    private onDiagramChange(model, callback) {
        this.setState(
            {
                model
            },
            callback
        );
    }

    private _diagramRef(ref: any) {
        this.diagram = ref;
        this.setState({});
    }

    private onClickUndo(ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) {
        const props = this.diagram.getDiagramProps();
        const { controller } = props;
        controller.run("undo", props);
    }

    private onClickRedo(ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) {
        const props = this.diagram.getDiagramProps();
        const { controller } = props;
        controller.run("redo", props);
    }


    private _items(): ICommandBarItemProps[] {
        const commands: ICommandBarItemProps[] = [];
        if (this.props.allowCommandBarNew) {
            commands.push({
                key: 'newItem',
                text: 'LOC New',
                cacheKey: 'addnew', // changing this key will invalidate this item's cache
                iconProps: { iconName: 'Add' },
            });
        }
        if (this.props.allowCommandBarOpen) {
            commands.push({
                key: 'open',
                text: 'LOC Open',
                iconProps: { iconName: 'Open' },
                onClick: () => { console.log('Open'); alert('FilePicker dialog'); },
            });
        }
        if (this.props.allowCommandBarDownload) {
            commands.push({
                key: 'download',
                text: 'LOC Download',
                iconProps: { iconName: 'Download' },
                onClick: () => console.log('Download'),
            });
        }
        commands.push({
            key: 'undo',
            text: 'LOC Undo',
            iconProps: { iconName: 'Undo' },
            onClick: this.onClickUndo
        });
        commands.push({
            key: 'redo',
            text: 'LOC Redo',
            iconProps: { iconName: 'Redo' },
            onClick: this.onClickRedo
        });
        return commands;
    }

    private _overflowItems(): ICommandBarItemProps[] {
        return [
            { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
            { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
            { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
        ];
    }

    private _farItems(): ICommandBarItemProps[] {
        return [{
            key: 'tile',
            text: 'Grid view',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Grid view',
            iconOnly: true,
            iconProps: { iconName: 'Tiles' },
            onClick: () => console.log('Tiles'),
        },
        {
            key: 'info',
            text: 'Info',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: () => console.log('Info'),
        },
        ];
    }

}
