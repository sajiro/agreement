import { ICommandBarItemProps } from "@fluentui/react";
import ActionBar from "components/shared/ActionBar";
import icons from "components/shared/Icons";
import useConstraintDialog from "hooks/constraint/useConstraintDialog";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import { ConstraintEditState, IConstraintValue } from "models/constraints";
import WithLoading from "components/shared/WithLoading";
import stringsConst from "consts/strings";

function ConstraintActionBar({
  constraintId,
  constraintValues,
}: {
  constraintId: string;
  constraintValues: IConstraintValue[] | undefined;
}) {
  const { openPanel: openConstraintPanel } = useConstraintPanel();
  const { openDeletionDialog } = useConstraintDialog();

  const additionalStyles = {
    commandBar: { root: { padding: 0, height: "32px" } },
  };

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: stringsConst.common.editKey,
      text: stringsConst.common.editName,
      iconProps: icons.edit,
      onClick: () => {
        openConstraintPanel(constraintId, ConstraintEditState.Edit);
      },
    },
  ];

  if (constraintValues?.filter((cv) => cv.inUse)?.length === 0) {
    commandBarItems.push({
      key: stringsConst.common.deleteKey,
      text: stringsConst.common.deleteName,
      iconProps: icons.delete,
      onClick: () =>
        openDeletionDialog({
          constraintId,
          existingConstraintValues: constraintValues || [],
        }),
    });
  }

  return (
    <ActionBar
      items={commandBarItems}
      overflowItems={undefined}
      additionalStyles={additionalStyles}
    />
  );
}

export const ConstraintActionBarWithLoading = WithLoading(ConstraintActionBar);

export default ConstraintActionBar;
