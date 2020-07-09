import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp';
import { ISPMindMapService } from "./ISPMindMapService";
import { IFile } from "../interfaces/IFiles";


export default class MockMindMapService implements ISPMindMapService {

    private model: string = JSON.stringify([
        {
            id: 'N1', title: 'Node1',
            position: { x: 10, y: 10 },
            children: [
                {
                    id: 'N11', title: 'Node11',
                    position: { x: 60, y: 80 },
                    hasParent: true
                }, {
                    id: 'N12', title: 'Node12',
                    position: { x: 60, y: 180 },
                    hasParent: true
                }, {
                    id: 'N13', title: 'Node13',
                    position: { x: 60, y: 280 },
                    hasParent: true,
                    children: [
                        {
                            id: 'N131', title: 'Node131',
                            position: { x: 160, y: 80 },
                            hasParent: true
                        },
                        {
                            id: 'N132', title: 'Node132',
                            position: { x: 160, y: 180 },
                            hasParent: true
                        }
                    ]
                }
            ]
        }
    ]);


    public getDocsFromLib(listId: string): Promise<IFile[]> {
        const files: IFile[] =
            [
                { fileName: 'MockFile1.mjson' },
                { fileName: 'MockFile2.mjson' },
                { fileName: 'MockFile3.mjson' }
            ];

        return new Promise((resolve) => {
            setTimeout(() => resolve(files), 1000);
        });
    }

    public loadDocument(listId: string, fileName: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.model), 1000);
        });

    }
    public saveDocument(listId: string, fileName: string, content: string): Promise<boolean> {
        this.model = content;
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
        });

    }


}