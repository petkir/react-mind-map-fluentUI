import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ListSubscriptionFactory } from "@microsoft/sp-list-subscription";

export interface IMindMapProps {
  title: string;
  hideWPTitle: boolean;
  doclib: string;
  fileName: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  context: WebPartContext;

  listSubscriptionFactory: ListSubscriptionFactory;
}
