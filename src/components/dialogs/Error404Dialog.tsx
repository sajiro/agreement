import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { Text } from "@fluentui/react/lib/Text";

import useDialog from "hooks/useDialog";
import usePanel from "hooks/usePanel";
import useRouter from "hooks/useRouter";
import { AgreementObjectType } from "models/agreements";
import { IDialogContentComponent, IError404Content } from "models/dialogs";
import { PanelType } from "models/panel";
import { routeDefinitions } from "router";
import { invalidateClauseCache } from "services/clause";
import { invalidateTemplateCache } from "services/template";
import stringsConst from "consts/strings";

const Error404Dialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const dispatch = useDispatch();
    const { goToRoute, back: goBack } = useRouter();
    const { closePanel } = usePanel(PanelType.Clause);
    const { closeDialog } = useDialog();

    const errorInfo = props as IError404Content;
    const errorString = errorInfo.targetStr;
    useImperativeHandle(ref, () => ({
      onProceed: () => {
        /* 
          If the original action's target was a revision, eg: a clause revision (vs a clause),
        clicking Refresh button should refresh both the list of clauses and the current clause's revisions,
        with the current clause still selected.
      */
        switch (errorInfo.targetType) {
          case AgreementObjectType.clause:
            dispatch(invalidateClauseCache(errorInfo.refreshObjectId || ""));

            if (!errorInfo.isTargetRevision) {
              goToRoute(
                routeDefinitions.Clauses.getRouteInfo({
                  isNothingSelected: true,
                })
              );
              closePanel();
            }

            break;
          case AgreementObjectType.constraint:
            break;
          case AgreementObjectType.customClause:
            break;
          case AgreementObjectType.template:
            dispatch(invalidateTemplateCache(errorInfo.refreshObjectId || ""));

            if (!errorInfo.isTargetRevision) {
              goToRoute(
                routeDefinitions.Templates.getRouteInfo({
                  isNothingSelected: true,
                })
              );
            }

            break;
          default:
            goBack();
        }

        closeDialog();
      },
    }));

    return (
      <Text>
        {stringsConst.dialogs.Error404.message({
          errorString,
        })}
      </Text>
    );
  }
);

export default Error404Dialog;
