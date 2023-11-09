import {
  ContextualMenuItemType,
  ICommandBarItemProps,
  IContextualMenuItem,
  VerticalDivider,
} from "@fluentui/react";
import ActionBar, {
  ICustomCommandBarStyles,
} from "components/shared/ActionBar";
import icons from "components/shared/Icons";
import IndexVersionMenu, {
  CurrentItemInfo,
} from "components/shared/IndexVersionMenu";
import WithLoading from "components/shared/WithLoading";
import {
  AgreementObjectEditState,
  AgreementObjectType,
  IAgreementObjectContentInfo,
  IAgreementObjectInfo,
} from "models/agreements";
import { IRevision, RevisionStatus } from "models/revisions";

import { DialogContentType } from "models/dialogs";
import useAgreementObjectDialog from "hooks/useAgreementObjectDialog";
import {
  getRevisionId,
  getRevisionStatusDisplayName,
  isDraftRevisionVariant,
  isPublishedRevisionVariant,
} from "helpers/revisions";
import { CSSProperties } from "react";
import useRouter from "hooks/useRouter";
import customTheme from "helpers/customTheme";
import useTemplatePreview from "hooks/template/useTemplatePreview";
import { useDispatch } from "react-redux";
import { resultSlotActions } from "store/ResultSlotSlice";
import { FormatDate } from "helpers/dates";
import { useTrackingContext } from "./TrackingContext";

type SharedActionBarProps = {
  objectType: AgreementObjectType;
  objectInfo: IAgreementObjectInfo;
  objectContentInfo?: IAgreementObjectContentInfo;
  openEditPanel: (...args: any) => void;
  setCurrentRevision: (revision: IRevision) => void;
  editState?: AgreementObjectEditState;
  disablePublishOverride?: boolean;
  additionalStyles?: {
    versionMenuStyles?: CSSProperties;
    actionBarStyles?: ICustomCommandBarStyles;
  };
  componentInfo?: string;
};

const getAgreementObject: any = (
  objectType: AgreementObjectType,
  objectInfo: IAgreementObjectInfo
) => {
  if (
    objectType === AgreementObjectType.clause ||
    objectType === AgreementObjectType.customClause
  ) {
    return objectInfo?.clause;
  }
  if (objectType === AgreementObjectType.template) {
    return objectInfo?.template;
  }

  return objectInfo?.clause;
};
// add a little extra padding per command button
const buttonStyle = { root: { padding: "0px 6px" } };
const dividerStyle = {
  divider: { height: "75%" },
};

// eslint-disable-next-line react/function-component-definition
const SharedActionBar = ({
  objectType,
  objectInfo,
  objectContentInfo, // only clauses and custom clauses have 'contents'
  openEditPanel,
  setCurrentRevision,
  editState,
  disablePublishOverride,
  additionalStyles,
  componentInfo,
}: SharedActionBarProps) => {
  const dispatch = useDispatch();
  const { openDeletionDialog, openUpdateRevisionDialog } =
    useAgreementObjectDialog();
  const { getRouteInfo } = useRouter();
  const routeInfo = getRouteInfo();
  const { trackEvent } = useTrackingContext();
  const { currentRevision } = objectInfo;
  const currentObject: any = getAgreementObject(objectType, objectInfo);
  const { resetConfig } = useTemplatePreview();
  const getRevisionMenuItemText = (
    revision: IRevision | undefined,
    isLatestGrouping: boolean
  ): string => {
    const revisionStatusStr = getRevisionStatusDisplayName(revision?.status);

    if (isLatestGrouping) {
      const revisionNumber = revision?.number ? ` - v${revision?.number}` : "";
      const additionalInfo =
        revision?.status === RevisionStatus.Pending
          ? ` - ${FormatDate(new Date(revision.effectiveDate))}`
          : revisionNumber;
      return `${revisionStatusStr}${additionalInfo}`;
    }

    if (
      revision?.status === RevisionStatus.Draft ||
      revision?.status === RevisionStatus.Test
    ) {
      return revisionStatusStr;
    }

    if (revision?.name) {
      return revision?.name;
    }

    if (revision?.effectiveDate) {
      return new Date(revision?.effectiveDate).toDateString();
    }

    return "-";
  };

  const getRevisionsAsContextualRevisionMenu = (
    revisions: IRevision[],
    isLatestGrouping: boolean
  ): IContextualMenuItem[] =>
    revisions.map((revision) => ({
      key: getRevisionId(revision),
      text: getRevisionMenuItemText(revision, isLatestGrouping),
      onClick: () => {
        setCurrentRevision(revision);
        if (
          revision.id !== currentRevision?.id &&
          componentInfo !== "TemplateEdit"
        ) {
          dispatch(resultSlotActions.setTriggered({ isTriggered: true }));
          resetConfig();
        }
      },
    }));

  const getRevisionMenuItems = (): IContextualMenuItem[] => {
    const revisions = objectInfo.revisions || [];
    const latestLiveRevisionIndex = revisions.findIndex(
      (r) => r.status === RevisionStatus.Live
    );
    const newGroupCutoffIndex =
      (latestLiveRevisionIndex !== -1
        ? latestLiveRevisionIndex
        : revisions.length) + 1;

    const contextualMenuItems = getRevisionsAsContextualRevisionMenu(
      revisions.slice(0, newGroupCutoffIndex),
      true
    );

    if (newGroupCutoffIndex < revisions.length) {
      contextualMenuItems.push({
        key: "older",
        itemType: ContextualMenuItemType.Header,
        text: "Older",
      });
      contextualMenuItems.push(
        ...getRevisionsAsContextualRevisionMenu(
          revisions.slice(newGroupCutoffIndex, revisions.length),
          false
        )
      );
    }

    // custom clause does not allow creating new revision in Agreement Center
    // but multiple revisions may be created from other apps (eg: Quote Center) interacting with Agreement Center
    if (objectType === AgreementObjectType.customClause) {
      return contextualMenuItems;
    }

    let isNewObject: boolean = false;
    if (objectType === AgreementObjectType.clause) {
      isNewObject = editState === AgreementObjectEditState.NewClause;
    } else if (objectType === AgreementObjectType.template) {
      isNewObject = editState === AgreementObjectEditState.NewTemplate;
    }

    const createNewRevisionDisabled =
      editState === AgreementObjectEditState.NewRevision;
    const isSingleUnpublishedRevision =
      currentRevision?.status === RevisionStatus.Unpublished &&
      revisions.length === 1;

    if (!isNewObject && !isSingleUnpublishedRevision) {
      contextualMenuItems.push(
        ...[
          { key: "divider_1", itemType: ContextualMenuItemType.Divider },
          {
            key: "new-version",
            text: "Create new version",
            disabled: createNewRevisionDisabled,
            buttonStyles: buttonStyle,
            itemProps: {
              styles: {
                root: {
                  color: createNewRevisionDisabled
                    ? customTheme.disabledSemanticColor
                    : customTheme.linkSemanticColor,
                },
              },
            },
            onClick: () => {
              trackEvent(
                `${objectType} create new version option selected from ${routeInfo?.component} page`
              );
              if (objectType === AgreementObjectType.template) {
                openEditPanel(
                  currentObject?.id,
                  currentRevision?.id,
                  AgreementObjectEditState.NewRevision
                );
              } else {
                openEditPanel(
                  {
                    clauseId: currentObject?.id,
                    revisionId: currentRevision?.id,
                  },
                  AgreementObjectEditState.NewRevision
                );
              }
            },
          },
        ]
      );
    }

    return contextualMenuItems;
  };

  const getRevisionMenu = (): JSX.Element => {
    const currentRevisionMenuItem: CurrentItemInfo = {
      text: getRevisionMenuItemText(currentRevision, true),
      status: currentRevision?.status,
      id: getRevisionId(currentRevision),
    };

    const menuItems = getRevisionMenuItems();
    return (
      <IndexVersionMenu
        menuItems={menuItems}
        currentItem={currentRevisionMenuItem}
        additionalStyles={additionalStyles?.versionMenuStyles}
        isCommandBarItem
      />
    );
  };

  const getCommandBarItems = (): ICommandBarItemProps[] => {
    const currentRevisionStatus = currentRevision?.status;
    const revisionNumber = currentRevision?.number
      ? ` - v${currentRevision.number}`
      : "";

    const updateRevisionDialogInfo = {
      objectType,
      objectName: `${currentObject?.name}${revisionNumber}`,
      id: currentObject?.id,
      revision: currentRevision!,
    };

    const commandBarItems: ICommandBarItemProps[] = [
      { key: "revisionsMenu", onRender: getRevisionMenu },
    ];

    // from the Info panel of Clause, Custom Clause, Template
    if (editState === undefined) {
      if (isDraftRevisionVariant(currentRevisionStatus)) {
        commandBarItems.push({
          key: "edit",
          text: "Edit",
          iconProps: icons.edit,
          buttonStyles: buttonStyle,
          onClick: () => {
            trackEvent(`${objectType} edit button clicked`);
            if (objectType === AgreementObjectType.template) {
              openEditPanel(currentObject?.id, currentRevision?.id);
            } else if (objectType === AgreementObjectType.customClause) {
              openEditPanel({
                templateId: currentObject?.templateId,
                clauseId: currentObject?.id,
                revisionId: currentRevision?.id,
              });
            } else {
              // Clause
              openEditPanel({
                clauseId: currentObject?.id,
                revisionId: currentRevision?.id,
              });
            }
          },
        });
      }
      // template info panel has "Open" button when status is not Draft or Unpublished
      else if (objectType === AgreementObjectType.template) {
        commandBarItems.push(
          {
            key: "open",
            text: "Open",
            iconProps: icons.open,
            buttonStyles: buttonStyle,
            onClick: () => {
              openEditPanel(currentObject?.id, currentRevision?.id);
            },
          },
          {
            key: "divider",
            itemType: ContextualMenuItemType.Divider,
            // eslint-disable-next-line react/no-unstable-nested-components
            onRender: () => <VerticalDivider styles={dividerStyle} />,
          }
        );
      }
    }

    const isPublishedVariant = isPublishedRevisionVariant(
      currentRevisionStatus
    );
    const isEditNewRevision =
      editState === AgreementObjectEditState.NewRevision;

    const hasObjectContents =
      objectContentInfo &&
      !objectContentInfo.isLoading &&
      objectContentInfo.contents &&
      objectContentInfo.contents.length !== 0;

    const disablePublish =
      disablePublishOverride ||
      isEditNewRevision ||
      (objectContentInfo && !hasObjectContents);

    if (
      (objectType === AgreementObjectType.clause &&
        editState !== AgreementObjectEditState.NewClause) ||
      (objectType === AgreementObjectType.template &&
        editState !== AgreementObjectEditState.NewTemplate)
    ) {
      const isDeleteRevision =
        objectInfo.revisions && objectInfo.revisions?.length > 1;
      const deleteButtonText = isDeleteRevision
        ? "Delete draft"
        : `Delete ${objectType.toLowerCase()}`;

      if (
        !isPublishedVariant &&
        currentRevisionStatus !== RevisionStatus.Test
      ) {
        commandBarItems.push(
          ...[
            {
              key: "delete",
              text: deleteButtonText,
              iconProps: icons.delete,
              disabled: isEditNewRevision,
              buttonStyles: buttonStyle,
              onClick: () => {
                openDeletionDialog({
                  title: `${deleteButtonText}?`,
                  objectType,
                  objectId: currentObject.id,
                  objectEtag: currentObject.etag,
                  revisionId: isDeleteRevision
                    ? currentRevision?.id
                    : undefined,
                  revisionEtag: isDeleteRevision
                    ? currentRevision?.etag
                    : undefined,
                });
                trackEvent(
                  `Delete ${objectType.toLowerCase()} button clicked from ${
                    routeInfo?.component
                  } page`
                );
              },
            },
            {
              key: "divider",
              itemType: ContextualMenuItemType.Divider,
              // eslint-disable-next-line react/no-unstable-nested-components
              onRender: () => <VerticalDivider styles={dividerStyle} />,
            },
          ]
        );

        if (
          currentRevisionStatus === RevisionStatus.Draft ||
          // unpublished templates have the "Test" button, unpublished clauses do not
          (currentRevisionStatus === RevisionStatus.Unpublished &&
            objectType === AgreementObjectType.template)
        ) {
          commandBarItems.push({
            key: "test",
            text: "Test",
            iconProps: icons.test,
            disabled: disablePublish,
            buttonStyles: buttonStyle,
            onClick: () => {
              openUpdateRevisionDialog({
                type: DialogContentType.Copy,
                ...updateRevisionDialogInfo,
              });
              trackEvent(
                `Test ${objectType.toLowerCase()} button clicked from ${
                  routeInfo?.component
                } page`
              );
            },
          });
        }
      }

      if (
        currentRevisionStatus === RevisionStatus.Test ||
        currentRevisionStatus === RevisionStatus.Pending
      ) {
        commandBarItems.push({
          key: "withdraw",
          text: "Withdraw",
          iconProps: icons.undo,
          buttonStyles: buttonStyle,
          onClick: () => {
            openUpdateRevisionDialog({
              type: DialogContentType.Withdraw,
              ...updateRevisionDialogInfo,
            });
          },
        });
      }

      if (!isPublishedVariant) {
        commandBarItems.push({
          key: "publish",
          text: "Publish",
          disabled: disablePublish,
          iconProps: icons.upload,
          buttonStyles: buttonStyle,
          onClick: () => {
            openUpdateRevisionDialog({
              type: DialogContentType.GoLive,
              ...updateRevisionDialogInfo,
            });
          },
        });
      }

      if (
        isPublishedVariant &&
        currentRevisionStatus !== RevisionStatus.Pending
      ) {
        commandBarItems.push({
          key: "createNewVersion",
          text: "Create New Version",
          iconProps: icons.add,
          buttonStyles: buttonStyle,
          onClick: () => {
            trackEvent(
              `${objectType} create new revision button clicked from ${routeInfo?.component} page`
            );
            if (objectType === AgreementObjectType.template) {
              openEditPanel(
                currentObject?.id,
                currentRevision?.id,
                AgreementObjectEditState.NewRevision
              );
            } else {
              openEditPanel(
                {
                  clauseId: currentObject?.id,
                  revisionId: currentRevision?.id,
                },
                AgreementObjectEditState.NewRevision
              );
            }
          },
        });
      }
    }

    if (
      objectType === AgreementObjectType.customClause &&
      editState !== AgreementObjectEditState.NewClause &&
      !isPublishedVariant
    ) {
      commandBarItems.push({
        key: "publish",
        text: "Publish",
        disabled: disablePublish,
        iconProps: icons.upload,
        buttonStyles: buttonStyle,
        onClick: () => {
          openUpdateRevisionDialog({
            type: DialogContentType.customClauseGoLive,
            ...updateRevisionDialogInfo,
            templateId: currentObject.templateId,
            templateName: currentObject.templateName,
          });
        },
      });
    }

    return commandBarItems;
  };

  return (
    <ActionBar
      items={getCommandBarItems()}
      overflowItems={undefined}
      additionalStyles={additionalStyles?.actionBarStyles}
    />
  );
};

export const SharedActionBarWithLoading = WithLoading(SharedActionBar);

export default SharedActionBar;
