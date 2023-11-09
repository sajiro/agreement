/* eslint no-param-reassign: "error" */

import { FetchBaseQueryError, QueryStatus } from "@reduxjs/toolkit/dist/query";
import { useConstraintEditErrorTracker } from "components/constraintPanel/ConstraintEditTracker";
import stringsConst from "consts/strings";
import { getMutationErrorAs, isMutationCompleted } from "helpers/mutation";
import usePanelMessenger from "hooks/usePanelMessenger";
import useRouter from "hooks/useRouter";
import {
  IConstraintEditInfo,
  IConstraintValuesMutationResponse,
} from "models/constraintMutation";
import { ConstraintEditState } from "models/constraints";
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { routeDefinitions } from "router";
import {
  invalidateConstraintCache,
  useCreateConstraintMutation,
  useCreateConstraintValuesMutation,
  useDeleteConstraintValuesMutation,
} from "services/constraint";
import useConstraintPanel from "../useConstraintPanel";

const useConstraintMutator = (constraintId: string | undefined) => {
  const { goToRoute } = useRouter();
  const { openPanel } = useConstraintPanel();
  const { setConstraintPanelMessage } = usePanelMessenger();
  const dispatch = useDispatch();
  const constraintEditTracker = useConstraintEditErrorTracker();
  const [createConstraint, createConstraintResult] =
    useCreateConstraintMutation();
  const [createConstraintValues, createConstraintValuesResult] =
    useCreateConstraintValuesMutation();
  const [deleteConstraintValues, deleteConstraintValuesResult] =
    useDeleteConstraintValuesMutation();
  const constraintMutationInfoRef = useRef<IConstraintEditInfo>();
  const constraintCreationTriggeredRef = useRef<boolean>(false);

  const triggerConstraintValueMutations = useCallback(
    (constraintIdToUse: string, constraintEditInfo: IConstraintEditInfo) => {
      constraintEditTracker.clear();
      const { newConstraintValues, removedConstraintValues } =
        constraintEditInfo;
      constraintMutationInfoRef.current = constraintEditInfo;
      constraintEditTracker.toggleIsSubmitting();

      if (newConstraintValues.length > 0) {
        createConstraintValues({
          allowRetry: false,
          constraintId: constraintIdToUse,
          constraintValueInfos: newConstraintValues.map((v) => ({
            id: v.id,
            name: v.name.trim(),
            display: v.display.trim(),
          })),
        });
      }

      if (removedConstraintValues.length > 0) {
        deleteConstraintValues({
          allowRetry: false,
          constraintId: constraintIdToUse,
          constraintValueInfos: removedConstraintValues.map((v) => ({
            id: v.id,
            name: v.name,
            display: v.display,
          })),
        });
      }
    },
    [deleteConstraintValues, createConstraintValues, constraintEditTracker]
  );

  const createNewConstraint = (constraintEditInfo: IConstraintEditInfo) => {
    constraintEditTracker.clear();
    const { constraintInfo } = constraintEditInfo;
    constraintMutationInfoRef.current = constraintEditInfo;

    const tmpName = constraintInfo!.name.trim();
    const tmpDisplay = constraintInfo!.display.trim();

    createConstraint({
      constraintInfo: {
        name: tmpName, // constraintInfo!.name,
        display: tmpDisplay, //  constraintInfo!.display,
      },
    });
  };

  useEffect(() => {
    if (
      isMutationCompleted(createConstraintResult) &&
      !constraintCreationTriggeredRef.current
    ) {
      constraintCreationTriggeredRef.current = true;

      if (createConstraintResult.isSuccess) {
        const constraintIdToUse = createConstraintResult.data;
        triggerConstraintValueMutations(
          constraintIdToUse,
          constraintMutationInfoRef.current!
        );
      }

      if (createConstraintResult.isError) {
        const error = createConstraintResult.error as FetchBaseQueryError;
        const isExistingConstraintName = error.status === 400; // Assume 400 Bad Request is because of name conflict
        if (isExistingConstraintName) {
          constraintMutationInfoRef.current!.constraintInfo!.errorMessage =
            stringsConst.common.panelMessages.errorConstraint;
          constraintEditTracker.setFailedConstraintCreation(
            constraintMutationInfoRef.current!.constraintInfo!
          );
        }

        setConstraintPanelMessage(
          {
            message: stringsConst.common.panelMessages.failConstraint,
            type: PanelMessageType.Error,
          },
          false
        );
        constraintCreationTriggeredRef.current = false;
        createConstraintResult.reset();
      }
    }
  }, [
    createConstraintResult,
    triggerConstraintValueMutations,
    constraintEditTracker,
    setConstraintPanelMessage,
  ]);

  useEffect(() => {
    const results = [
      createConstraintValuesResult,
      deleteConstraintValuesResult,
    ];
    const isAllCompleted = results.every(
      (r) => r.status !== QueryStatus.pending
    );

    const wasResultTriggered = !!results.find((r) => isMutationCompleted(r));

    if (isAllCompleted && wasResultTriggered) {
      let isPartialSuccess = false;

      if (createConstraintValuesResult.isError) {
        const constraintValuesResponse =
          getMutationErrorAs<IConstraintValuesMutationResponse>(
            createConstraintValuesResult.error
          );
        isPartialSuccess =
          isPartialSuccess || constraintValuesResponse.successfulIds.length > 0;
        const failedValueIds = constraintValuesResponse.failureIds;
        const failedCreates =
          constraintMutationInfoRef.current!.newConstraintValues.filter((v) =>
            failedValueIds.includes(v.id)
          );
        failedCreates.forEach((v) => {
          v.errorMessage =
            stringsConst.common.panelMessages.failAddValueConstraint;
        });
        constraintEditTracker.setFailedValueCreations(failedCreates);
      }

      if (deleteConstraintValuesResult.isError) {
        const deleteValuesResponse =
          getMutationErrorAs<IConstraintValuesMutationResponse>(
            deleteConstraintValuesResult.error
          );
        isPartialSuccess =
          isPartialSuccess || deleteValuesResponse.successfulIds.length > 0;
        const failedValueIds = deleteValuesResponse.failureIds;
        const failedDeletes =
          constraintMutationInfoRef.current!.removedConstraintValues.filter(
            (v) => failedValueIds.includes(v.id)
          );
        failedDeletes.forEach((v) => {
          v.errorMessage =
            stringsConst.common.panelMessages.failDeleteConstraint;
        });
        constraintEditTracker.setFailedValueDeletions(failedDeletes);
      }

      const hasSuccess =
        createConstraintValuesResult.isSuccess ||
        deleteConstraintValuesResult.isSuccess ||
        isPartialSuccess;
      if (hasSuccess) {
        const constraintIdToUse = createConstraintResult.data || constraintId;
        dispatch(invalidateConstraintCache(constraintIdToUse));
      }

      let message;
      const hasFailure =
        createConstraintValuesResult.isError ||
        deleteConstraintValuesResult.isError;
      message = hasFailure
        ? stringsConst.common.panelMessages.failSaveConstraint
        : message;
      message =
        hasFailure && hasSuccess
          ? stringsConst.common.panelMessages.failSaveAllEditConstraint
          : message;
      const successMessage = createConstraintResult.isSuccess
        ? stringsConst.common.panelMessages.createConstraint
        : stringsConst.common.panelMessages.successConstraint;
      message = hasSuccess && !hasFailure ? successMessage : message;
      const messageInfo: IPanelMessage = {
        message,
        type: hasFailure ? PanelMessageType.Error : PanelMessageType.Success,
      };
      setConstraintPanelMessage(messageInfo, hasFailure && hasSuccess);

      if (constraintCreationTriggeredRef.current) {
        goToRoute(
          routeDefinitions.Constraints.getRouteInfo({
            constraintId: createConstraintResult.data,
          })
        );
        openPanel(createConstraintResult.data, ConstraintEditState.Edit);
        constraintCreationTriggeredRef.current = false;
      }

      constraintEditTracker.toggleIsSubmitting();

      createConstraintResult.reset();
      createConstraintValuesResult.reset();
      deleteConstraintValuesResult.reset();
    }
  }, [
    createConstraintResult,
    createConstraintValuesResult,
    deleteConstraintValuesResult,
    constraintEditTracker,
    constraintId,
    dispatch,
    goToRoute,
    openPanel,
    setConstraintPanelMessage,
  ]);

  return { triggerConstraintValueMutations, createNewConstraint };
};

export default useConstraintMutator;
