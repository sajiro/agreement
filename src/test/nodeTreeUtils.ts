import { Observable } from "components/shared/nodes/Observable";
import { ConstraintOperator } from "models/constraints";
import { INode, INodeTree } from "models/node";
import { ISlotConstraint, ITemplateRevisionSlot } from "models/slot";
import { v1 as uuidv1 } from 'uuid';

export const getTestSlot = (position: number, parentSlotId: string, constraints?: ISlotConstraint[]): ITemplateRevisionSlot => ({
  length: 0,
  createdBy: "",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
  etag: "",
  category: "",
  partId: "",
  partName: "",
  name: "",

  id: uuidv1(),
  position,
  parentSlotId,
  constraints: constraints || [],
});

export const getTestNode = (content: ITemplateRevisionSlot, depth: number, globalPosition: number): INode<ITemplateRevisionSlot> => ({
  id: content.id,
  parentId: content.parentSlotId,
  height: 0,
  isOpen: true,
  contentHash: "",
  content,
  depth,
  globalPosition
});

export const getTestNodeTree = (nodes: INode<ITemplateRevisionSlot>[], childNodeMappings: { [key: string]: string[] }): INodeTree<ITemplateRevisionSlot> => {
  const nodeMappings: { [key: string]: INode<ITemplateRevisionSlot> } = {};
  nodes.forEach(n => { nodeMappings[n.id] = n; });
  return {
    observable: new Observable(),
    nodes: nodeMappings,
    childNodeMappings
  };
};

export const getTestConstraint = (key: string, operator: ConstraintOperator, value: string): ISlotConstraint => ({
  // Constraint equality based on the following
  key,
  operator,
  value,

  valueDisplay: value,
  keyDisplay: key,
  keyId: ""
});