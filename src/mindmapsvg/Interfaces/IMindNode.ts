import { IMindPosition } from '.';


export interface IMindNode {
  id: string;
  title: string;
  htmlDescription?: string;
  position: IMindPosition;
  hasParent?: boolean;
  childsExpanded?:boolean;
  children?: IMindNode[];
}
