import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

import * as strings from 'MindMapWebPartStrings';
import MindMap from './components/MindMap';
import { IMindMapProps } from './components/IMindMapProps';
import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp';
import { ISPMindMapService } from './services/ISPMindMapService';
import { IFile } from './interfaces/IFiles';
import MockMindMapService from './services/MockMindMapService';
import SPMindMapService from './services/SPMindMapService';
import { ListSubscriptionFactory } from '@microsoft/sp-list-subscription';

export interface IMindMapWebPartProps {
  hideWPTitle: boolean;
  title: string;
  doclib: string;
  fileName: string;
}

export default class MindMapWebPart extends BaseClientSideWebPart<IMindMapWebPartProps> {
  private dataService: ISPMindMapService;
  private filesloaded: boolean = false;
  private files: IFile[] = [];
  public render(): void {
    const element: React.ReactElement<IMindMapProps> = React.createElement(
      MindMap,
      {
        title: this.properties.title,
        doclib: this.properties.doclib,
        fileName: this.properties.fileName,
        hideWPTitle: this.properties.hideWPTitle,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        context: this.context,
        displayMode: this.displayMode,
        listSubscriptionFactory: new ListSubscriptionFactory(this),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {

    await super.onInit();

    sp.setup({
      spfxContext: this.context
    });
    if (Environment.type == EnvironmentType.Local || Environment.type == EnvironmentType.Test) {
      this.dataService = new MockMindMapService();
    } else {
        this.dataService = new SPMindMapService();
    }
    if (this.displayMode === DisplayMode.Edit) {
      if (!!this.properties.doclib) {
        this.files = await this.dataService.getDocsFromLib(this.properties.doclib);
        this.filesloaded = true;
      }
    }



  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'doclib') {
      if (newValue !== oldValue && !!newValue && (newValue as string).length > 0) {
        // reload files
        this.filesloaded = false;
        this.dataService.getDocsFromLib(this.properties.doclib).then(files => {
          this.files = files;
          this.filesloaded = true;
          if (this.context.propertyPane.isPropertyPaneOpen()) {
            this.context.propertyPane.refresh();
          }

        });

      }
    }

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [

                PropertyPaneToggle('hideWPTitle', {
                  label: strings.propertyPaneHideWPHeadline,
                  checked: this.properties.hideWPTitle,
                  onText: strings.propertyPaneHideWPHeadlineHide,
                  offText: strings.propertyPaneHideWPHeadlineShow
                }),
                PropertyFieldListPicker('doclib', {
                  label: strings.propertyPaneSelectDocLib,
                  selectedList: this.properties.doclib,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneDropdown('fileName', {
                  label: 'TODO Picker for File (OR Create NEwFile)',
                  selectedKey: this.properties.fileName,
                  options: this.files.map((file, i) => {
                    return ({ key: file.fileName, text: file.fileName, index: i });
                  }),
                  disabled: !!this.properties.doclib && !this.filesloaded
                }),

              ]
            }
          ]
        }
      ]
    };
  }
}
