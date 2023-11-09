
export interface ITree<T> {
  nodes: { [key: string]: T };
  childNodeMappings: { [key: string]: string[] };
}