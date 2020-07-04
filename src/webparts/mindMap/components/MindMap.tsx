import * as React from 'react';
import styles from './MindMap.module.scss';
import { IMindMapProps } from './IMindMapProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { MindMapComponent } from "../../../mindmap";
import  MindMapSVGComponent  from "../../../mindmapsvg/MindmapSVGComponent";


export default class MindMap extends React.Component<IMindMapProps, {}> {
  public render(): React.ReactElement<IMindMapProps> {
    return (<div>
      {/*       <MindMapComponent
      allowCommandBarNew={true}
      allowCommandBarDownload={true}
      allowCommandBarOpen={true}
      />
      */
      }
      <MindMapSVGComponent />
      </div>
    );
  }
}
