import * as React from 'react';
import styles from './MindMapZoomComponent.module.scss';
import { IconButton, Slider, Stack } from 'office-ui-fabric-react'

export interface IMindMapZoomComponentProps {
  eventExpandAll: (expand: boolean) => void;
  eventZoomLevelChanged: (percentage: number) => void;
  zoomLevel?: number;

}

export interface IMindMapZoomComponentState { }

export class MindMapZoomComponent extends React.Component<IMindMapZoomComponentProps, IMindMapZoomComponentState> {

  public render(): React.ReactElement<IMindMapZoomComponentProps> {
    const { zoomLevel, eventExpandAll, eventZoomLevelChanged } = this.props;
    return (
      <div>
        <Stack verticalAlign={'center'}>
          <Stack>
            <IconButton iconProps={{ iconName: 'CollapseContent' }}
              title="LOCCollaps" ariaLabel="LOCCollaps"
              onClick={() => eventExpandAll(false)} />
          </Stack>
          <Stack>
            <IconButton iconProps={{ iconName: 'ExploreContent' }}
              title="LOCExpand" ariaLabel="LOCExpand"
              onClick={() => eventExpandAll(true)} />
          </Stack>
          <Stack>
            <Slider
              label="LOC Zoom"
              min={10}
              max={200}
              step={10}
              defaultValue={zoomLevel ? zoomLevel : 100}
              valueFormat={(value: number) => `${value}%`}
              showValue={true}
              onChange={(value: number) => eventZoomLevelChanged(value)}
            />
          </Stack>
        </Stack>
      </div >
    );
  }
}
