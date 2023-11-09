
export enum PanelMessageType {
  Success = "Success",
  Error = "Error",
  Canceled = "Canceled"
}

export interface IPanelMessage {
  type?: PanelMessageType;
  message?: string;
  /* 
    If the panel action has partial result (eg: upload/delete multiple translations, some succeed and some fail), 
    type would be PanelMessageType.Error, and the panel displays an error message. 
  
    In some cases we need a partial success flag to trigger follow-up work, such as invalidateClauseCache (for upload/delete translations)
  */
  isPartialSuccess?: boolean;
}

export interface IPanelMessageCallout {
  subMessages: IPanelMessage[];
  infoText: string;
}

export interface IPanelMessageSlice extends IPanelMessage {
  callout?: IPanelMessageCallout;
}