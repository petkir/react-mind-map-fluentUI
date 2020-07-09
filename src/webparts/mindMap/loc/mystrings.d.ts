declare interface IMindMapWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  propertyPaneHideWPHeadline: string;
  propertyPaneHideWPHeadlineShow: string;
  propertyPaneHideWPHeadlineHide: string;
  propertyPaneSelectDocLib: string;


  PlaceholderIconText: string;
  PlaceholderDescription: string;
  PlaceholderButtonLabel: string;
  SpinnerLabel: string;

}

declare module 'MindMapWebPartStrings' {
  const strings: IMindMapWebPartStrings;
  export = strings;
}
