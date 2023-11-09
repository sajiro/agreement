import _ from "lodash";

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const stringsConst = {
  common: {
    showAll: "show all",
    hide: "hide",
    clause: "Clause",
    remove: "remove",
    selectValuesPlaceholder: "Select values",
    previewZeros: "00000000-0000-0000-0000-000000000000",
    clear: "clear",
    editName: "Edit",
    editKey: "edit",
    usedInTemplate: "Used in template",
    category: "Category",
    description: "Description",
    displayOption: "Display Option",
    id: "ID",
    psCategory: "PS Category",
    translations: "Translations",
    close: "Close",
    cancel: "Cancel",
    create: "Create",
    save: "Save",
    errorMessageEmpty: "Must not be empty",
    errorMessageWhitespace: "Must not contain only whitespace",
    deleteName: "Delete",
    deleteKey: "delete",
    customClause: "Custom Clause",
    template: "Template",
    selectAnOption: "select an option",
    Today: "Today",
    Date: "Date",
    Language: "Language",
    EnterValue: "Enter value",
    Optional: "Optional",
    Display: "Display",
    officeOnlineError: "Office online failed to load due to:",
    listings: {
      nameValue: "Name",
      nameKey: "name",
      descriptionValue: "Description",
      descriptionKey: "description",
      statusValue: "State",
      statusKey: "status",
    },
    infoItems: {
      name: "Name",
      friendlyName: "Friendly Name",
      lastModifiedKey: "Last modified",
      modifiedByKey: "Modified by",
    },
    closeButtonAriaLabel: "Close",
    panelMessages: {
      newTemplate: "Template successfully created.",
      newRevision: "New version successfully created.",
      failTemplate: "Template creation failed, please try again.",
      failRevision: "Could not create a new version, please try again.",
      partialFailClause:
        "We were able to save some of your edits but not all of them. Review the details below to understand what needs to be retried.",
      partialFailConstraint:
        "Some of your changes were saved, others were not. Changes that were not saved are indicated above. Please try saving again.",
      errorConstraint:
        "The name is already in use. Please choose a unique name",
      failConstraint: "Creation failed. Try again.",
      failAddValueConstraint: "Unable to add value. Please try again.",
      failDeleteConstraint: "Unable to delete value. Please try again.",
      failSaveConstraint: "Unable to save.",
      failSaveAllEditConstraint: "Unable to save all edits.",
      createConstraint: "Constraint Created.",
      successConstraint: "Updates successfully saved.",
    },
    noTranslations: "No documents have been uploaded yet.",
    tracking: {
      buttonClick: "Button Click",
      dialogOpen: "Dialog Open",
    },
  },
  clause: {
    ClausePropertiesView: {
      howToReadThis: "How to read this",
    },
    Clauses: {
      stateValue: "State",
      stateKey: "state",
    },
  },
  clausePanel: {
    ClausePanel: {
      createNewClause: "Create new clause",
      getRevisionsError: "Unable to retrieve revisions for selected clause",
    },
    ClauseDynamicValuesForm: {
      intro:
        "The clause contains the following dynamic fields. If you wish to see how information is displayed in these fields, enter the appropriate values below then switch to the Preview tab.",
    },
    ClausePropertiesForm: {
      clauseNameLabel: "Clause name",
      versionNameLabel: "Version description",
      versionPlaceholder: "optional, short description of changes",
      categoryLabel: "Category",
      categoryPlaceholder: "Select an option",
      displayLabel: "Display Option",
      psCategoryLabel: "PS Category",
    },
    ClauseTranslationRemover: {
      unselectAll: "Unselect all",
      selectAll: "Select all",
      deleteExistingTranslations: "Delete existing translations",
      selectTranslationsDesc:
        "Select the translations you would like removed. Selected translations won't be deleted until you save.",
    },
    ClauseTranslationUploader: {
      uploadNewTranslations: "Upload new translations",
      uploadNewTranslationsIntro:
        "If you are uploading replacement documents, no need to delete first as the files will be replaced. But, if it helps to keep track of whats been done, by all means delete the existing documents first.",
    },
  },
  constraint: {
    ConstraintGroupedList: {
      headingValues: "Values",
      callOutMessage: "How to read this",
    },
  },
  constraintPanel: {
    ConstraintActions: {
      ActionWarning: {
        heading: "Is the name correct?",
        description:
          "Once created, the constraint name will no longer be editable.",
      },
    },
    ConstraintCreator: {
      constraintNameLabel: "Constraint name",
      constraintDisplayLabel: "Constraint friendly name",
      emptyErrorMessage: _.template(
        "{{constraintObjectType}} name cannot be empty"
      ),
      whitespaceErrorMessage: _.template(
        "{{constraintObjectType}} name cannot be only whitespace"
      ),
      constraintDescription:
        "Names are used to identify constraints and values. The names can contain spaces. Friendly names are only needed if the name may not be readable on its own.",
    },
    ConstraintEditor: {
      optionalClauseInfo:
        "If the constraint you're creating is intended to indicate an optional clause, use a single value named 'true'.",
    },
    ConstraintPanel: {
      newConstraint: "New Constraint",
    },
    ConstraintValuesCreator: {
      newValues: "New values",
      addSingleValueBtn: "Add single value",
      addMultipleValuesAria: "add single value & add multiple values",
      addOneOrMoreValues: "Add one or more values.",
    },
    ConstraintValuesRemover: {
      deletableValues: "Deletable values",
      renameDesc: "To rename a value, delete it and then add a new one.",
      initialDeleteValueDesc:
        "All constraint values are in use. None may be deleted.",
    },
    LockedConstraintValuesDisplay: {
      inUseValues: "Locked values",
      callOutMessage:
        "Once a value has been used to configure a clause within a template, then it is locked and no longer editable.",
    },
  },
  customClause: {
    CustomClauses: {
      templateValue: "Template",
      templateKey: "templateName",
    },
  },
  dialogs: {
    AgreementObjectCopyDialog: {
      proceed: _.template(
        "Your {{objectTypeToLowerCase}} will be locked and enabled for testing."
      ),
      success: _.template(
        "The {{objectTypeToLowerCase}} is ready for testing."
      ),
      error: _.template(
        "The {{objectTypeToLowerCase}} could not be enabled for testing."
      ),
    },
    AgreementObjectDeletionDialog: {
      proceed: _.template(
        "All changes will be discarded and the {{deletionObjectTypeStr}} will be removed from the library."
      ),
      proceedRevision: _.template(
        "All changes will be discarded and the {{deletionObjectTypeStr}} will be restored to its previous version."
      ),
      success: _.template("The {{target}} was successfully deleted."),
      error: _.template(
        "We were unable to delete the {{target}}. Please try again."
      ),
    },
    AgreementObjectGoLiveDialog: {
      invalidEffectiveDateApiError: "Invalid EffectiveDate",
      revisionsRetrievalError: "Error occurred when retrieving revisions for publish date validation.",
      publishedClausesRetrievalError: "Error occurred when retrieving published clauses publish date validation.",
      samePublishedDateError: _.template(
        "Another version of this {{objectTypeToLowerCase}} is scheduled to be published on the same day and only a single version can be published per day. Either pick another day to publish this version, or withdraw the other version, make your changes, and re-publish."
      ),
      proceed:
        "Once published, the updates will go live to customers at 12:00 am UTC on the day you specify below. The current version will be locked and no longer editable.",
      success: _.template(
        "The {{objectTypeToLowerCase}} was successfully published."
      ),
      error: _.template(
        "The {{objectTypeToLowerCase}} could not be published."
      ),
    },
    AgreementObjectWithdrawDialog: {
      activeClauseError: "Unable to withdraw the version because it is the only published version of the clause and it's been used in the template(s) below. To withdraw this version, please remove it from the template first.",
      usedInTemplatesRetrievalError: "Error occurred when retrieving template usage info for withdraw validation.",
      clauseRevisionsRetrievalError: "Error occurred when retrieving clause revisions for withdraw validation.",
      proceed: _.template(
        "The {{objectTypeToLowerCase}} will be switched to a draft state, will again be editable, and will no longer be included in testing."
      ),
      proceedIsPending: _.template(
        "The {{objectTypeToLowerCase}} will be switched to a draft state, will again be editable, and will not go live until republished."
      ),
      success: _.template(
        "The {{objectTypeToLowerCase}} was successfully withdrawn and converted back to draft."
      ),
      error: _.template(
        "The {{objectTypeToLowerCase}} could not be withdrawn."
      ),
    },
    ConstraintDeletionDialog: {
      proceed: "Are you sure you want to delete the constraint?",
      success: "The constraint was successfully deleted.",
      error: "We were unable to delete the constraint. Please try again.",
    },
    CustomClauseGoLiveDialog: {
      proceed:
        "The custom clause will be locked to all further editing and will be immediately available.",
      success: "The custom clause was successfully published.",
      error: "The custom clause could not be published.",
    },
    Error404: {
      message: _.template(
        "It appears the {{errorString}} you're working on has been deleted by someone else. Please refresh the page and try again."
      ),
    },
    Error412: {
      message:
        "It appears someone else has made changes before you. Please refresh the page and try again.",
      title: "Data is out of sync",
    },
    Error405: {
      message:
        "Our apologies, we were unable to load all the data. Please refresh the page and try again.",
      title: "System error",
    },
    Error403: {
      message: "I'm sorry but you are not authorized to view this page.",
      title: "Authentication error",
    },
    ErrorNoRole: {
      message:
        "I'm sorry but you do not have the correct role assigned to view this data.",
    },
    TemplateCloneFail: {
      draftDelete: {
        success: "The draft was successfully deleted.",
        error: "We were unable to delete the draft. Please try again.",
      },
      error: "We were unable to create a new version. Please try again.",
      partialCreationError: {
        title: "Error - new version partially created",
        message:
          "A new version was created but we were unable to copy the clauses. Our recommendation is you delete the draft and try again.",
      },
    },
    UnsavedChangesDialog: {
      message: _.template(
        "The {{objectName}} has unsaved changes which will be discarded. Are you sure you want to continue?"
      ),
    },
    useDialog: {
      success: "Success",
      error: "Error",
      missingData: "Missing data",
      processing: {
        title: "Processing....",
        message: "One moment while we create you a new version.",
      },
      moveConstraints: "Move constraints to the group?",
    },
    useConstraintDialog: {
      deleteConstraint: "Delete Constraint?",
      unsavedChanges: "Unsaved changes",
    },
  },
  shared: {
    FileUploader: {
      dragDropText: "Drop Word Documents Here",
    },
    NoItemSelectedDisplay: {
      title: "Nothing selected",
      content: _.template(
        "Select a {{itemType}} from the table to see details."
      ),
    },
    SharedPropertiesView: {
      version: "Version",
      status: "Status",
      published: "Published",
      publishedBy: "Published by",
      lastModified: "Last modified",
      modifiedBy: "Modified by",
      description: "Description",
      goLive: "Go live",
    },
  },
  translations: {
    invalidMimeTypeErrorMessage:
      "Invalid file type. Only '.docx' are supported",
    maxFileSizeErrorMessage: "File size exceeds maximum limit of ",
    languageNotSupportedErrorMessage: "Language not supported",
    invalidFileNameErrorMessage:
      "File name should be suffixed with language locale",
  },
  template: {
    TemplatePropertiesView: {
      descriptionHeading: "Template description",
    },
  },
  templateEdit: {
    resultTooltipPart1: "Based on the assembly settings, the items marked below will be included in the rendered document. Unmarked items will be excluded.",
    resultTooltipPart2: "If a group is excluded, then everything in the group is automatically excluded as well. If a group is included, then the children are evaluated and included or excluded based on their own constraints.",
    messages: {
      NewVersionCreatedMessage: "New version created",
      SaveErrorMessage: "Unable to save, please try again.",
      EmptyTemplateGenericMessage: "The template does not contain any clauses.",
      EmptyTemplateEditStructureMessage:
        "The template does not contain any clauses. Use the Add Clause panel to find and add clauses to the template.",
    },
    translation: {
      OpenClause: "Open clause",
    },
    constraint: {
      and: "AND",
      addConstraints: "add constraints",
      equals: "Equals (=)",
      doesNotEqual: "Does not equal (!=)",
      theClauseWillBeRendered:
        "The clause will be rendered to the output document when the criteria defined below is met. If no constraints are set, the clause will always be rendered.",
    },
    preview: {
      defaultPreviewError:
        "Preview content either does not exist or could not be loaded. Please try again later.",
      noDoc: "No document is available with the current preview settings.",
      headerFooterExplanation:
        "A template may contain multiple clauses of type header/footer but they must be uniquely configured so that no more than one is used at a time.",
      headerFooterError:
        "Based on the current assembly settings, multiple header/footers are trying to be rendered at once. Please check the constraints on the clauses listed below and ensure they are mutually exclusive.",
    },
    previewPanel: {
      clausesRendered: "Based on the settings below, items included in the rendered document are indicated in the view column.",
      Include: "Include",
      AssemblySettings: "Assembly settings",
      ShowTestClauses: "Show test clauses",
      noSettings:
        "There are no available assembly settings because no constraints have been applied.",
    },
    propertiesForm: {
      versionPlaceholder: "optionally describe version updates",
    },
    TemplateEditStructureHeader: {
      clause: "Clause",
      include: "Include clause if",
    },
    AddClausePanel: {
      noValue: "The selected contraint does not have value",
      desc: "Drag a clause onto the Structure canvas to specifically place the clause within the template. Or select the clauses you want and use the Add to Top or Add to Bottom buttons to insert the clauses at the top or bottom.",
    },
  },
  templatePanel: {
    TemplatePanel: {
      createNewTemplate: "Create new template",
    },
  },
};

export default stringsConst;
