import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  invalidateTemplateCache,
  useUpdateRevisionMutation,
  useUpdateTemplatePropertiesMutation,
} from "services/template";
import _ from "lodash";
import { RevisionStatus } from "models/revisions";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

import { MessageBarType } from "@fluentui/react";
import { templateEditActions } from "store/TemplateEditSlice";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import Forms from "../shared/Forms";
import { FormFieldType, ICustomFormField } from "../../models/properties";
import {
  ITemplatePropertiesFormUpdatePayload,
  IModifiableTemplateProperties,
  TemplateEditState,
} from "../../models/templatePanel";
import { ITemplateInfo } from "../../models/templates";
import { hasDifferentValuePairs, isEmptyString, nameOf } from "../../helpers/forms";
import { RootState } from "../../store";
import { templateFormsActions } from "../../store/templateFormSlice";

function TemplatePropertiesForm({
  editState,
  templateInfo,
}: {
  editState: TemplateEditState;
  templateInfo: ITemplateInfo;
}) {
  const dispatch = useDispatch();
  const isNewTemplate = editState === TemplateEditState.NewTemplate;
  const { propertiesForm, isSubmitting } = useSelector(
    (state: RootState) => state.templateForms
  );

  const [updateTemplateProperties, templatePropertiesUpdateResult] =
    useUpdateTemplatePropertiesMutation();
  const [updateRevisionProperty, revisionPropertiesUpdateResult] =
    useUpdateRevisionMutation();

  useEffect(() => {
    if (isNewTemplate) return;
    dispatch(templateFormsActions.initializeForm({ templateInfo, editState }));
  }, [
    templateInfo.template,
    isNewTemplate,
    dispatch,
    editState,
    templateInfo.currentRevision,
  ]);

  useEffect(() => {
    const templateMutationComplete =
      templatePropertiesUpdateResult.status !== QueryStatus.pending;
    const revisionMutationComplete =
      revisionPropertiesUpdateResult.status !== QueryStatus.pending;
    if (templateMutationComplete && revisionMutationComplete) {
      if (
        templatePropertiesUpdateResult.isError ||
        revisionPropertiesUpdateResult.isError
      ) {
        dispatch(
          templateEditActions.setMessage({
            message: stringsConst.templateEdit.messages.SaveErrorMessage,
            type: MessageBarType.error,
          })
        );
      } else {
        dispatch(invalidateTemplateCache(templateInfo.template!.id));
      }

      templatePropertiesUpdateResult.reset();
      revisionPropertiesUpdateResult.reset();
    }
  }, [
    templatePropertiesUpdateResult,
    revisionPropertiesUpdateResult,
    dispatch,
  ]);

  // for disabling the form when an action is occurring (data is being retrieved or is submitting data)
  const isLoading = templateInfo.isLoading || isSubmitting;
  const isLiveOrTest =
    templateInfo.currentRevision?.status === RevisionStatus.Live ||
    templateInfo.currentRevision?.status === RevisionStatus.Test;
  const formFields: ICustomFormField[] = [
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableTemplateProperties>("name"),
      propertyType: nameOf<ITemplatePropertiesFormUpdatePayload>("properties"),
      defaultValue: templateInfo.template?.name,
      value: propertiesForm?.name || "",
      label: "Template name",
      required: true,
      disabled: isLoading || false,
      dataAutomationId: "templatePropertiesForm-templateNameField",
    },
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableTemplateProperties>("revision"),
      propertyType: nameOf<ITemplatePropertiesFormUpdatePayload>("properties"),
      defaultValue: templateInfo.currentRevision?.name,
      value: propertiesForm?.revision || "",
      label: "Version name",
      placeholder: stringsConst.templateEdit.propertiesForm.versionPlaceholder,
      required: false,
      disabled: isLoading || isNewTemplate || isLiveOrTest,
      hidden: isNewTemplate,
      dataAutomationId: "templatePropertiesForm-templateRevisionField",
    },
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableTemplateProperties>("description"),
      propertyType: nameOf<ITemplatePropertiesFormUpdatePayload>("properties"),
      defaultValue: templateInfo.template?.description,
      value: propertiesForm?.description || "",
      label: "Description",
      required: false,
      disabled: isLoading || false,
      dataAutomationId: "templatePropertiesForm-templateDescriptionField",
    },
  ];

  const onPropertyChanged = (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined
  ) => {
    const updatedFormField = formFields.find(
      (f) => f.propertyType === propertyType && f.propertyName === propertyName
    );
    updatedFormField!.value = newValue;
    const updatedProperty: any = {
      [propertyType]: { [propertyName]: newValue },
    };
    dispatch(
      templateFormsActions.updatePropertiesFormValue(updatedProperty.properties)
    );
  };
  const onPropertyBlur = (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined
  ) => {
    const updatedFormField = formFields.find(
      (f) => f.propertyType === propertyType && f.propertyName === propertyName
    );

    updatedFormField!.value = newValue;

    if (isNewTemplate) {
      return;
    }

    const formFieldValuesInfo = formFields.map((f) => ({
      existing: f.defaultValue!,
      new: f.value!,
      value: f.value,
      required: f.required,
    }));
    const isNonEmpty = newValue && !isEmptyString(newValue.trim());
    const hasChanges = hasDifferentValuePairs(formFieldValuesInfo) && (!updatedFormField?.required || isNonEmpty);
    const clonedTemplateInfo = _.cloneDeep(templateInfo);

    if (clonedTemplateInfo.template && hasChanges) {
      if (propertyName === "revision") {
        const updatedTemplateInfo: any = {
          ...clonedTemplateInfo.currentRevision,
          [`name`]: newValue?.trim(),
        };
        updateRevisionProperty({
          templateId: clonedTemplateInfo.template.id,
          revision: updatedTemplateInfo,
        });
      } else {
        const updatedTemplateInfo = {
          ...clonedTemplateInfo.template,
          [propertyName]:
            propertyName === "name" || propertyName === "description"
              ? newValue?.trim()
              : newValue,
        };
        updateTemplateProperties(updatedTemplateInfo);
      }
    }
  };

  const formWrapperStyle = isNewTemplate
    ? {}
    : {
        height: "calc(100vh - 180px)",
        ...customTheme.templateEditTabsContainer,
        padding: 24,
      };

  return (
    <div style={formWrapperStyle}>
      <Forms
        formFields={formFields}
        onPropertyChanged={onPropertyChanged}
        onPropertyBlur={onPropertyBlur}
      />
    </div>
  );
}
export default TemplatePropertiesForm;
