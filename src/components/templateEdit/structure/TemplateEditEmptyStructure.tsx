import { ROOT_NODE_ID } from "consts/globals";
import stringsConst from "consts/strings";
import useNodePositioner from "hooks/template/edit/useNodePositioner";
import { INode } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { useSelector } from "react-redux";
import { RootState } from "store";
import TemplateEditEmptyContentDisplay from "../TemplateEditEmptyContentDisplay";

const getRootNode = (): INode<ITemplateRevisionSlot> => ({
  id: ROOT_NODE_ID,
  parentId: undefined,
  content: undefined,
  globalPosition: 0,
  height: 0,
  isOpen: false,
  depth: 0
});

function TemplateEditEmptyStructure({ height }: { height: number; }) {
  // Need to treat as Node Group so target node group lookup resolves
  // Need to use dragBottomInfo to leverage off existing Node Group logic which allows for an empty slot group
  const { isLoading } = useSelector((state: RootState) => state.templateEdit);
  const { dropBottomInfo } = useNodePositioner(getRootNode(), true, isLoading);

  return (
    <div style={{ height }} ref={dropBottomInfo.drop}>
      <TemplateEditEmptyContentDisplay message={stringsConst.templateEdit.messages.EmptyTemplateEditStructureMessage} />
    </div>
  );
}

export default TemplateEditEmptyStructure;