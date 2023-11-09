import {
  IComboBoxOption,
  mergeStyleSets,
  Panel,
  PanelType as FluentPanelType,
  Text,
} from "@fluentui/react";
import PanelHeader from "components/shared/panel/PanelHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetAllConstraintsForEditConstraintQuery } from "services/constraint";
import _ from "lodash";
import { ISlotConstraint, ITemplateRevisionSlot } from "models/slot";
import {
  ConstraintOperator,
  IConstraintTemplateEditPanel,
} from "models/constraints";
import useObserver from "hooks/useObserver";
import stringsConst from "consts/strings";
import ConstraintEditList from "./ConstraintEditList";
import ConstraintAdder from "./ConstraintAdder";
import ConstraintEditPanelActions from "./ConstraintEditPanelActions";
import { useTemplateEditStructureNodeManager } from "../structure/TemplateEditStructureNodeManager";

const ConstraintEditPanelStyles = mergeStyleSets({
  p: {
    marginTop: 11,
    fontSize: 12,
    width: 400,
  },
  ButtonContainer: {
    marginTop: 27,
    width: 150,
  },
});

function ConstraintEditPanel({ closePanel }: { closePanel: () => void }) {
  const [options, setOptions] = useState<
    IConstraintTemplateEditPanel[] | undefined
  >([]);
  const { data: filteredItems, isLoading } =
    useGetAllConstraintsForEditConstraintQuery();
  const { nodeTree, getSelectedNodes } = useTemplateEditStructureNodeManager();
  const nodeTreeRefreshToken = useObserver(nodeTree.observable); // Need to update used constraints if node tree was refreshed
  const slotRef = useRef<ITemplateRevisionSlot>();

  const [constraints, setConstraints] = useState<ISlotConstraint[]>([]);
  const [usedConstraints, setUsedConstraints] = useState<string[]>([]);
  const [noValues, setNoValues] = useState(false);

  useEffect(() => {
    if (!isLoading && filteredItems) {
      const constraintItems = filteredItems?.map((obj) => ({
        ...obj,
        key: obj.name,
        text: obj.display,
      }));
      setOptions(constraintItems);
    }
  }, [filteredItems, isLoading]);

  useEffect(() => {
    const firstSelectedNode = getSelectedNodes()[0];
    if (firstSelectedNode) {
      slotRef.current = firstSelectedNode.content!;
      setConstraints(slotRef.current.constraints);
    }
  }, [nodeTreeRefreshToken, getSelectedNodes]);

  useEffect(() => {
    setUsedConstraints(constraints.map((c) => c.key));
  }, [constraints, setUsedConstraints]);

  const Header = useCallback(() => {
    const title = slotRef.current?.partName || slotRef.current?.name;
    return <PanelHeader title={title} onClosePanel={closePanel} />;
  }, [closePanel]);

  const Footer = useCallback(() => {
    const isDisabled =
      !constraints.every((c) => c.value !== "") ||
      _.isEqual(slotRef.current?.constraints, constraints);
    return (
      <ConstraintEditPanelActions
        slot={slotRef.current}
        constraints={constraints}
        onClosePanel={closePanel}
        disabled={isDisabled}
        noValues={noValues}
      />
    );
  }, [constraints, closePanel]);

  const onConstraintUpdated = useCallback(
    (
      modifiedConstraint: ISlotConstraint,
      constraintIndex: number,
      remove?: boolean
    ) => {
      setConstraints((previousConstraints) => {
        const clonedConstraints = _.cloneDeep(previousConstraints);

        clonedConstraints[constraintIndex] = modifiedConstraint;

        if (remove) {
          clonedConstraints.splice(constraintIndex, 1);
          setTimeout(() => {
            setNoValues(false);
          }, 0);
          return clonedConstraints;
        }

        const selectedconst = filteredItems?.find(
          (i) => i.name === clonedConstraints[constraintIndex].key
        );

        clonedConstraints[constraintIndex].keyId = selectedconst?.key as string;

        return clonedConstraints;
      });
    },
    [setConstraints, filteredItems]
  );

  const onConstraintNoValues = useCallback(() => {
    setNoValues(true);
  }, [setConstraints]);

  const addConstraints = useCallback(
    (option?: IComboBoxOption | undefined) => {
      const selected = option?.selected;
      setConstraints((previousConstraints) => {
        const clonedConstraints = _.cloneDeep(previousConstraints);
        const currInd = clonedConstraints.findIndex(
          (t) => t.key === option!.key
        );
        if (!selected) {
          clonedConstraints.splice(currInd, 1);
        } else {
          const selectedconst = filteredItems?.find(
            (i) => i.name === option.key
          );
          clonedConstraints.push({
            key: option?.key as string,
            operator: ConstraintOperator.Include,
            value: "",
            valueDisplay: "",
            keyId: selectedconst?.key as string,
            keyDisplay: option?.text,
          });
        }
        setNoValues(false);
        return clonedConstraints;
      });
    },
    [setConstraints, filteredItems]
  );

  return (
    <Panel
      data-automation-id="templateEdit-structure-editConstraints-panel"
      isOpen
      styles={{
        main: { zIndex: 15 },
        content: { height: "calc(100vh - 262px)" },
      }}
      hasCloseButton={false}
      isFooterAtBottom
      type={FluentPanelType.custom}
      customWidth="643px"
      closeButtonAriaLabel={stringsConst.common.close}
      onRenderHeader={Header}
      onRenderFooter={Footer}
      overlayProps={{
        style: { zIndex: 10 },
      }}
      layerProps={{
        hostId: "TemplateEditStructureLayer",
        insertFirst: true,
        eventBubblingEnabled: true,
        onLayerWillUnmount: () => {
          document.body.style.removeProperty("overflow");
        },
        onLayerDidMount: () => {
          document.body.style.overflow = "hidden";
        },
      }}
    >
      <Text block className={ConstraintEditPanelStyles.p}>
        {stringsConst.templateEdit.constraint.theClauseWillBeRendered}
      </Text>
      <div className={ConstraintEditPanelStyles.ButtonContainer}>
        <ConstraintAdder
          usedConstraints={usedConstraints}
          constraintsList={options}
          onConstraintSelected={addConstraints}
        />
      </div>
      {constraints.length !== 0 && (
        <ConstraintEditList
          constraints={constraints}
          constraintsList={options}
          usedConstraints={usedConstraints}
          onConstraintUpdated={onConstraintUpdated}
          onConstraintNoValues={onConstraintNoValues}
        />
      )}
    </Panel>
  );
}

export default ConstraintEditPanel;
