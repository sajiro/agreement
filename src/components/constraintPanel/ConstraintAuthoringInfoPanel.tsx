import {
  FontIcon,
  mergeStyleSets,
  Panel,
  PanelType as FluentPanelType,
  PrimaryButton,
  Text,
} from "@fluentui/react";
import PanelHeader from "components/shared/panel/PanelHeader";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import { IPanelProps, PanelType } from "models/panel";
import { panelActions } from "store/panelSlice";
import { useDispatch } from "react-redux";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

const styles = mergeStyleSets({
  constraintTextPanel: {
    marginLeft: "-15px",
  },
});
// eslint-disable-next-line react/function-component-definition
const ConstraintAuthoringInfoPanel = ({
  panelInfo,
  isBlocking,
  persistentInfo,
}: IPanelProps) => {
  const dispatch = useDispatch();
  const { closePanel } = useConstraintPanel();
  const authoringInfoShown =
    (persistentInfo.previouslyOpened as boolean) || false;
  const isPanelOpen =
    panelInfo.panelType === PanelType.Constraint && !authoringInfoShown;
  const titleIcon = () => (
    <FontIcon
      iconName="Info"
      style={{ marginRight: 10, fontSize: 20, color: customTheme.focusColor }}
    />
  );

  return (
    <Panel
      className={styles.constraintTextPanel}
      hasCloseButton={false}
      isFooterAtBottom
      type={FluentPanelType.custom}
      customWidth="30%"
      isOpen={isPanelOpen}
      closeButtonAriaLabel={stringsConst.common.closeButtonAriaLabel}
      onDismiss={closePanel}
      isBlocking={isBlocking}
      // eslint-disable-next-line react/no-unstable-nested-components
      onRenderHeader={() => (
        <PanelHeader
          title="Before you begin"
          onClosePanel={closePanel}
          TitleIcon={titleIcon}
        />
      )}
    >
      <div style={{ lineHeight: "20px" }}>
        <br />
        <Text block>
          Constraint authoring has a few peculiarities you need to take into
          account to have a successful experience.
        </Text>
        <ul style={{ marginLeft: "-15px" }}>
          <li>
            <Text block>
              The constraint name will be locked upon creation so double check
              your spelling.
            </Text>
          </li>
          <li>
            <Text block>
              Once a constraint has been used, i.e. applied to a clause within a
              template, it may no longer be deleted.
            </Text>
          </li>
          <li>
            <Text block>
              Once a constraint <i>value</i> has been used, it too becomes
              locked and may no longer be edited or deleted.
            </Text>
          </li>
          <li>
            <Text block>
              Adding a new value to a constraint is not considered editing and
              can be done at anytime.
            </Text>
          </li>
          <li>
            <Text block>
              Constraints and their values are live and available as soon as you
              create them.
            </Text>
          </li>
        </ul>
        <Text block>
          Based on the above limitations, we recommend you plan your constraint
          carefully and complete the authoring in as few sessions as possible;
          preferably a single session.
        </Text>
        <br />
        <PrimaryButton
          data-automation-id="constraintautoringinfobutton"
          text="Got it"
          onClick={() => {
            dispatch(
              panelActions.updateCache({ key: "previouslyOpened", value: true })
            );
          }}
        />
      </div>
    </Panel>
  );
};

export default ConstraintAuthoringInfoPanel;
