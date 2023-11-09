import {
  ISlotGroupCreationContent,
  IDialogContentComponent,
} from "models/dialogs";
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { ConstraintDisplay } from "components/shared/nodes/NodeConstraints";
import { useTemplateStructureEditor } from "hooks/template/mutation/useTemplateStructureEditor";
import useDialog from "hooks/useDialog";

const SlotGroupCreationDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const { closeDialog } = useDialog();
    const { createSlotGroup } = useTemplateStructureEditor(closeDialog);
    const { slotsToGroup, target, commonConstraints } =
      props as ISlotGroupCreationContent;

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        createSlotGroup(slotsToGroup, target, commonConstraints);
      },
      onCancel: () => {
        createSlotGroup(slotsToGroup, target, []);
      },
    }));

    return (
      <>
        <Text block>
          The selected items all have the same constraint. Would you like the
          constraint removed from the line items and moved to the new group or
          should we leave it as is?
        </Text>
        <br />
        <Text style={{ fontWeight: 600 }}>Common Constraints</Text>
        <ConstraintDisplay constraints={commonConstraints} />
      </>
    );
  }
);

export default SlotGroupCreationDialog;
