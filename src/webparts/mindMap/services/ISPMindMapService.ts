import { IFile } from "../interfaces/IFiles";

export interface ISPMindMapService
{
    getDocsFromLib(listId:string): Promise<IFile[]>;
    
    loadDocument(listId:string,fileName:string):Promise<string>;
    saveDocument(listId:string,fileName:string,content:string):Promise<boolean>;

}