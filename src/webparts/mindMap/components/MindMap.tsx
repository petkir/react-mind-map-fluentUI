import * as React from 'react';

import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';

import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

import MindMapSVGComponent from "../../../mindmapsvg/MindmapSVGComponent";
import { ISPMindMapService } from '../services/ISPMindMapService';

import MockMindMapService from '../services/MockMindMapService';
import styles from './MindMap.module.scss';
import { IMindMapProps } from './IMindMapProps';
import * as strings from 'MindMapWebPartStrings';
import SPMindMapService from '../services/SPMindMapService';
import { IMindNode } from '../../../mindmapsvg/Interfaces';

import { ListSubscriptionFactory, IListSubscription } from '@microsoft/sp-list-subscription';
import { Guid } from '@microsoft/sp-core-library';
import { isEqual } from '@microsoft/sp-lodash-subset';

export interface IMindMapState {
  loading: boolean;
  isConfigured: boolean;
  model?: IMindNode[];
  errorMessage?: string;

}


export default class MindMap extends React.Component<IMindMapProps, IMindMapState> {

  private _listSubscription: IListSubscription;

  private dataService: ISPMindMapService;
  constructor(props: IMindMapProps) {
    super(props);

    this.state = {
      loading: false,
      isConfigured: false,

    };
  }
  public componentDidMount(): void {
    if (Environment.type == EnvironmentType.Local || Environment.type == EnvironmentType.Test) {
      this.dataService = new MockMindMapService();
    } else {
      this.dataService = new SPMindMapService();
    }
    console.log('componentDidMount initload');
    this._loadData();

  }

  public componentDidUpdate(prevProps: Readonly<IMindMapProps>, prevState: Readonly<IMindMapState>, snapshot?: any): void {
    if (this.props.doclib === prevProps.doclib && this.props.fileName === prevProps.fileName) {
      return;
    }
    console.log('componentDidUpdate reload');
    this._loadData();
  }
  public render(): React.ReactElement<IMindMapProps> {
    const { doclib, fileName, hideWPTitle, displayMode } = this.props;
    const { model, errorMessage } = this.state;

    const isLoading: boolean = this.state.loading;
    const isConfigured = this.state.isConfigured;


    return (<div>
      {!hideWPTitle && (<WebPartTitle displayMode={displayMode}
        title={this.props.title}
        updateProperty={this.props.updateProperty} />
      )}
      {!isConfigured && !isLoading && (<Placeholder iconName='Edit'
        iconText={strings.PlaceholderIconText}
        description={strings.PlaceholderDescription}
        buttonLabel={strings.PlaceholderButtonLabel}
        hideButton={displayMode === DisplayMode.Read}
        onConfigure={this._onConfigure} />
      )}
      {isConfigured && isLoading && (
        <Spinner label={strings.SpinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
      {isConfigured && !isLoading && (
        <MindMapSVGComponent
          model={!!this.state.model ? this.state.model : []}
          modelChanged={this._modelChanged.bind(this)}
        />)
      }
      {!!errorMessage && (<div>{errorMessage}</div>)}
      {/*       <MindMapComponent
      allowCommandBarNew={true}
      allowCommandBarDownload={true}
      allowCommandBarOpen={true}
      />
      */
      }

    </div>
    );
  }

  private _modelChanged(model: IMindNode[]): void {
    // wir gehen aus, dass alles gut geht

    this.setState({ model: model }, this._savefile);
  }

  private _onConfigure = () => {
    this.props.context.propertyPane.open();
  }

  private _savefile(): void {
    if (!this.props.doclib || this.props.doclib.length === 0 ||
      !this.props.fileName || this.props.fileName.length === 0
    ) {
      this.setState({ isConfigured: false, loading: false });
    } else {
      const { doclib, fileName } = this.props;
      this.dataService.saveDocument(doclib, fileName, JSON.stringify(this.state.model));
      //ERROR handling missing
    }
  }

  private _loadData(): void {
    if (!this.props.doclib || this.props.doclib.length === 0 ||
      !this.props.fileName || this.props.fileName.length === 0
    ) {
      this.setState({ isConfigured: false, loading: false });
    } else {
      this.setState({ isConfigured: true, loading: true },this.internalloadData);
    }
  }

  private internalloadData():void {
    const { doclib, fileName } = this.props;
    this.dataService.loadDocument(doclib, fileName).then((content: string) => {
      this.setState({
        isConfigured: true,
        model: !!content ? JSON.parse(content) : [],
        loading: false
      }, this._configureListSubscription
      );
    });
  }

  private _configureListSubscription(): void {
    if (!this.props.doclib || !this.props.fileName) {
      if (this._listSubscription) {
        this.props.listSubscriptionFactory.deleteSubscription(this._listSubscription);
      }
      return;
    }
    console.log('_configureListSubscription');
    // remove existing subscription if any
    if (this._listSubscription) {
      console.log('_configureListSubscription deleteSubscription');
      this.props.listSubscriptionFactory.deleteSubscription(this._listSubscription);
    }
    const { context } = this.props;
    if (Environment.type != EnvironmentType.Local) {
      this.props.listSubscriptionFactory.createSubscription({
        siteId: context.pageContext.site.id ? context.pageContext.site.id : undefined,
        webId: context.pageContext.web.id ? context.pageContext.web.id : undefined,
        listId: Guid.parse(this.props.doclib),
        callbacks: {
          notification: this._doclibUpdate.bind(this)
        }
      });
    }
  }

  private _doclibUpdate(): void {
    console.log('_doclibUpdate');
 
    const { doclib, fileName } = this.props;
    //TODO check if Date HAs chanced and my change was not this 
    this.dataService.loadDocument(doclib, fileName).then((content: string) => {
      console.log('loadDocument compare Changes');
 
      if (!isEqual(JSON.parse(content), this.state.model)) {
        console.log('_doclibUpdate has change');
        this.setState({
          model: !!content ? JSON.parse(content) : [],
        });
      } else {
        console.log('_doclibUpdate no update required');
      }
    });
  }

}
