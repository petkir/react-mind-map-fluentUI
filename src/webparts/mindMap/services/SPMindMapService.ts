import "@pnp/polyfill-ie11";
import { sp, IFileInfo } from "@pnp/sp/presets/all";
import { ISPMindMapService } from "./ISPMindMapService";
import { IFile } from "../interfaces/IFiles";


export default class SPMindMapService implements ISPMindMapService {




    public async getDocsFromLib(listId: string): Promise<IFile[]> {

        return sp.web.lists.getById(listId).rootFolder.files.get().then(
            (files) => files.map((fileInfo: IFileInfo) => {
                return {
                    fileName: fileInfo.Name

                };
            }));

    }

    public async loadDocument(listId: string, fileName: string): Promise<string> {
        return sp.web.lists.getById(listId).rootFolder.files.getByName(fileName).getText();

    }
    public async saveDocument(listId: string, fileName: string, content: string): Promise<boolean> {

        return sp.web.lists.getById(listId).rootFolder.files.getByName(fileName).setContent(content).then((res) =>
            true
        );
    }
}