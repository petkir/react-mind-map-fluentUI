export interface IMindNode {
    id: string;
    title: string;
    htmlDescription?: string;
    position: IMindPosition;
    hasParent?: boolean;
    children?: IMindNode[];
}

export interface IMindPosition {
    x: number;
    y: number;
}
