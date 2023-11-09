import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LayerHost, mergeStyles } from "@fluentui/react";
import { ITemplateRevisionSlot } from "models/slot";
import { useCallback } from "react";
import { NodeRendererProps } from "models/node";
import ConstraintSlotNode from "components/shared/nodes/ConstraintSlotNode";
import NodeList from "components/shared/nodes/NodeList";
import NodeDragLayer from "components/shared/nodes/NodeDragLayer";
import { RevisionStatus } from "models/revisions";
import customTheme from "helpers/customTheme";
import { isSlotGroup } from "helpers/slot";

import TemplateEditStructureHeader from "./TemplateEditStructureHeader";
import {
  TemplateEditStructureNodeManager,
  useTemplateEditStructureNodeManager,
} from "./TemplateEditStructureNodeManager";
import TemplateEditPanelOverlay from "./TemplateEditPanelOverlay";
import { TemplateEditStructureSelectionManager } from "./TemplateEditStructureSelectionManager";

const containerClass = mergeStyles({
  height: "100%",
  ...customTheme.templateEditTabsContainer,
});

type TemplateEditStructureProps = {
  templateId: string;
  revisionId: string;
  revisionStatus: RevisionStatus;
};

function TemplateEditStructure({
  templateId,
  revisionId,
  revisionStatus,
}: TemplateEditStructureProps) {
  const nodeRenderer = useCallback(
    ({
      data: { node, nestingLevel },
      isOpen,
      style,
      resize,
      setOpen,
    }: NodeRendererProps<ITemplateRevisionSlot>) => (
      <>
        {null}
        {node.content && (
          <ConstraintSlotNode
            node={node}
            depth={nestingLevel}
            positionStyle={style}
            isOpen={isOpen}
            isSlotGroup={isSlotGroup(node.content!)}
            resize={resize}
            setOpen={setOpen}
          />
        )}
      </>
    ),
    []
  );

  return (
    <div
      className={containerClass}
      data-automation-id="templateEdit-structure-pivot"
    >
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <TemplateEditStructureNodeManager
            {...{ templateId, revisionId, revisionStatus }}
          >
            <TemplateEditStructureSelectionManager>
              <TemplateEditStructureHeader revisionStatus={revisionStatus} />
              <NodeList
                nodeRenderer={nodeRenderer}
                useNodeTreeProvider={useTemplateEditStructureNodeManager}
              />
              <NodeDragLayer />
              <TemplateEditPanelOverlay />
            </TemplateEditStructureSelectionManager>
          </TemplateEditStructureNodeManager>
        </LayerHost>
      </DndProvider>
    </div>
  );
}

export default TemplateEditStructure;
