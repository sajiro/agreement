import { MessageBarType } from "@fluentui/react";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import stringsConst from "consts/strings";
import {
  getAppliedRepositionSlotGroup,
  getDefaultSlotGroup,
  getSlotsFromClauses,
  removeConstraints,
} from "helpers/slot";
import useRouter from "hooks/useRouter";
import { IPublishedClause } from "models/clauses";
import {
  ISlotConstraint,
  ISlotPositioningTarget,
  ISlotUpdateInfo,
  ITemplateRevisionSlot,
  SlotOperationType,
} from "models/slot";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { constraintApi } from "services/constraint";
import {
  slotApi,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
  useUpdateSlotsMutation,
} from "services/slot";
import { templateEditActions } from "store/TemplateEditSlice";

export const useTemplateStructureEditor = (
  onMutationComplete: () => void = () => {}
) => {
  const { getRouteInfo } = useRouter();
  const routeInfo = getRouteInfo();
  const templateId = routeInfo!.objectIdInfo!.templateId!;
  const revisionId = routeInfo!.objectIdInfo!.revisionId!;

  const dispatch = useDispatch();
  const [updateSlotsTrigger, updateSlotsResult] = useUpdateSlotsMutation();
  const [createSlotsTrigger, createSlotsResult] = useCreateSlotsMutation();
  const [deleteSlotsTrigger, deleteSlotsResult] = useDeleteSlotsMutation();
  const slotsToGroupRef = useRef<{
    slotsToGroup: ITemplateRevisionSlot[];
    commonConstraints: ISlotConstraint[];
  }>();

  const updateSlotPositions = useCallback(
    (slots: ITemplateRevisionSlot[], parentSlotId: string) => {
      dispatch(templateEditActions.setLoadingState(true));
      updateSlotsTrigger({
        templateId,
        revisionId,
        parentSlotId,
        updateInfos: slots.map<ISlotUpdateInfo>((slot) => ({
          slotId: slot.id,
          etag: slot.etag,
          parentSlotId: slot.parentSlotId,
          updateOperations: [
            {
              op: SlotOperationType.Replace,
              path: "parentSlotId",
              value: parentSlotId,
            },
            {
              op: SlotOperationType.Replace,
              path: "position",
              value: slot.position,
            },
          ],
        })),
      });
    },
    [templateId, revisionId, updateSlotsTrigger, dispatch]
  );

  const createSlots = useCallback(
    (
      slotsToCreate: ITemplateRevisionSlot[],
      target: ISlotPositioningTarget
    ) => {
      const { targetSlotGroup, parentSlotId } = target;
      const appliedRepositionSlotGroup = getAppliedRepositionSlotGroup(
        slotsToCreate,
        target
      );
      const movedSlots = appliedRepositionSlotGroup.filter((s) =>
        targetSlotGroup.find(
          (os) => os.id === s.id && os.position !== s.position
        )
      );
      const newSlots = appliedRepositionSlotGroup.filter((s) =>
        slotsToCreate.find((os) => os.id === s.id)
      );

      dispatch(templateEditActions.setLoadingState(true));
      updateSlotPositions(movedSlots, parentSlotId);
      createSlotsTrigger({
        templateId,
        revisionId,
        parentSlotId,
        slots: newSlots.map((s) => ({
          category: s.category,
          partId: s.partId,
          partName: s.partName,
          position: s.position,
          parentSlotId: s.parentSlotId,
          name: s.name,
          constraints: s.constraints,
        })),
      });
    },
    [templateId, revisionId, updateSlotPositions, createSlotsTrigger, dispatch]
  );

  const repositionSlots = useCallback(
    (slotsToMove: ITemplateRevisionSlot[], target: ISlotPositioningTarget) => {
      const appliedRepositionSlotGroup = getAppliedRepositionSlotGroup(
        slotsToMove,
        target
      );
      const { targetSlotGroup, parentSlotId } = target;
      const nonMovedUpdatedSlots = appliedRepositionSlotGroup.filter((s) =>
        targetSlotGroup.find(
          (os) => os.id === s.id && os.position !== s.position
        )
      );
      const movedSlots = appliedRepositionSlotGroup.filter((s) =>
        slotsToMove.find((os) => os.id === s.id)
      );
      const slotsToUpdate = new Set<ITemplateRevisionSlot>([
        ...nonMovedUpdatedSlots,
        ...movedSlots,
      ]); // Remove duplicates, due to repositions on same level

      dispatch(templateEditActions.setLoadingState(true));
      updateSlotPositions(Array.from(slotsToUpdate), parentSlotId);
    },
    [templateId, revisionId, updateSlotPositions, dispatch]
  );

  const createClauseSlots = useCallback(
    (clauses: IPublishedClause[], target: ISlotPositioningTarget) => {
      const { parentSlotId } = target;
      const slotsToCreate = getSlotsFromClauses(clauses, parentSlotId);
      createSlots(slotsToCreate, target);
    },
    [createSlots]
  );

  const updateSlotConstraints = useCallback(
    (slot: ITemplateRevisionSlot, newConstraints: ISlotConstraint[]) => {
      dispatch(templateEditActions.setLoadingState(true));
      dispatch(constraintApi.util.invalidateTags(["Constraint", "ConstraintValues"]));
      updateSlotsTrigger({
        templateId,
        revisionId,
        parentSlotId: "undefined", // Set to invalid value to prevent parent slot's cache from deleting
        updateInfos: [
          {
            slotId: slot.id,
            etag: slot.etag,
            parentSlotId: slot.parentSlotId,
            updateOperations: [
              {
                op: SlotOperationType.Replace,
                path: "constraints",
                value: newConstraints.map(c => ({ key: c.key, operator: c.operator, value: c.value })),
              },
            ],
          },
        ],
      });
    },
    [templateId, revisionId, updateSlotsTrigger, dispatch]
  );

  const deleteSlots = useCallback(
    (slots: ITemplateRevisionSlot[]) => {
      dispatch(templateEditActions.setLoadingState(true));
      deleteSlotsTrigger({
        templateId,
        revisionId,
        slotInfos: slots.map((slot) => ({
          parentSlotId: slot.parentSlotId,
          slotId: slot.id,
        })),
      });
    },
    [templateId, revisionId, deleteSlotsTrigger, dispatch]
  );

  const createSlotGroup = useCallback(
    (
      slotsToGroup: ITemplateRevisionSlot[],
      target: ISlotPositioningTarget,
      commonConstraints: ISlotConstraint[]
    ) => {
      if (slotsToGroup.length > 0)
        slotsToGroupRef.current = { slotsToGroup, commonConstraints };
      const slotGroupSlot = getDefaultSlotGroup(
        target.parentSlotId,
        commonConstraints
      );
      createSlots([slotGroupSlot], target);
    },
    [createSlots]
  );

  const setSlotGroupName = useCallback(
    (slotGroup: ITemplateRevisionSlot, name: string) => {
      updateSlotsTrigger({
        templateId,
        revisionId,
        parentSlotId: "undefined", // Set to invalid value to prevent parent slot's cache from deleting
        updateInfos: [
          {
            slotId: slotGroup.id,
            etag: slotGroup.etag,
            parentSlotId: slotGroup.parentSlotId,
            updateOperations: [
              { op: SlotOperationType.Replace, path: "name", value: name },
            ],
          },
        ],
      });
    },
    [updateSlotsTrigger, templateId, revisionId]
  );

  const addSlotsToNewSlotGroup = useCallback(
    (slotGroupId: string) => {
      const { slotsToGroup, commonConstraints } = slotsToGroupRef.current!;
      const targetInfo: ISlotPositioningTarget = {
        parentSlotId: slotGroupId,
        targetSlotGroup: [],
      };
      const appliedRepositionSlotGroup = getAppliedRepositionSlotGroup(
        slotsToGroup,
        targetInfo
      );
      appliedRepositionSlotGroup.forEach((slot) => {
        removeConstraints(slot.constraints, commonConstraints);
      });
      updateSlotsTrigger({
        templateId,
        revisionId,
        parentSlotId: slotGroupId,
        updateInfos: appliedRepositionSlotGroup.map((slot) => ({
          slotId: slot.id,
          parentSlotId: slot.parentSlotId,
          etag: slot.etag,
          updateOperations: [
            {
              op: SlotOperationType.Replace,
              path: "parentSlotId",
              value: slotGroupId,
            },
            {
              op: SlotOperationType.Replace,
              path: "position",
              value: slot.position,
            },
            {
              op: SlotOperationType.Replace,
              path: "constraints",
              value: slot.constraints,
            },
          ],
        })),
      });
    },
    [updateSlotsTrigger, templateId, revisionId]
  );

  useEffect(() => {
    const mutationStatuses = [
      updateSlotsResult.status,
      createSlotsResult.status,
      deleteSlotsResult.status,
    ];
    const allUninitialized = mutationStatuses.every(
      (status) => status === QueryStatus.uninitialized
    );
    const allComplete = mutationStatuses.every(
      (status) => status !== QueryStatus.pending
    );
    const hasResultsToProcess = !allUninitialized && allComplete;

    if (hasResultsToProcess && !slotsToGroupRef.current) {
      if (mutationStatuses.find((s) => s === QueryStatus.fulfilled)) {
        dispatch(slotApi.util.invalidateTags([{ type: "slotTree" }]));
        dispatch(slotApi.util.invalidateTags([{ type: "slotTranslations" }]));
      } else {
        // Need to disable loading state here as rehydration won't occur (where loading state gets reset)
        dispatch(templateEditActions.setLoadingState(false));
      }

      if (mutationStatuses.find((s) => s === QueryStatus.rejected)) {
        dispatch(
          templateEditActions.setMessage({
            message: stringsConst.templateEdit.messages.SaveErrorMessage,
            type: MessageBarType.error,
          })
        );
      }

      onMutationComplete();
      updateSlotsResult.reset();
      createSlotsResult.reset();
      deleteSlotsResult.reset();
    }

    // Needs to be below final process results above as slotToGroup gets cleared
    // Assumes if slotsToGroup list is set, then createSlotsResult is for creating a slot group and only that operation was triggered
    if (createSlotsResult.isSuccess && slotsToGroupRef.current) {
      const slotGroupId = createSlotsResult.data![0].id; // Assumes that only one slot group is created at a time
      addSlotsToNewSlotGroup(slotGroupId);
      slotsToGroupRef.current = undefined;
    }
  }, [
    updateSlotsResult,
    createSlotsResult,
    deleteSlotsResult,
    addSlotsToNewSlotGroup,
    onMutationComplete,
  ]);

  return {
    repositionSlots,
    createClauseSlots,
    updateSlotConstraints,
    deleteSlots,
    createSlotGroup,
    setSlotGroupName,
  };
};
