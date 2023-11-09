# Template Structure Edit

Entry Point: **src\components\templateEdit\structure\TemplateEditStructure.tsx**

A Template Revision's structure is a nested tree structure comprised of objects called **slots**, which have the following variations:

- Slot Group: container for holding other slots, optional constraints applied to it, position (relative to other slots at the same "level")
- Slot: references a particular clause (part), optional constraints applied to it, position (relative to other slots at the same "level")

The main purpose of this component is to facilitate editing of this structure. Actions it supports are:

- Repositioning slots via drag/drop or up/down buttons (repositioning also includes in/out of groups)
- Slot Group creation (create an empty group or move slots under a group)
- Adding constraints to a slot
- Adding new clauses (creates a new slots)
- Removing slots

## Code Structure

Template Structure (slot) edit is supported the following major pieces:

- Slot RTK Query API definition
- React V-Tree (used to display the slots)
- Slot wrapper object **INode<T>** that contains additional info required by React-VTree
- TemplateEditStructureNodeManager Context (functions to support updating React-VTree node related info)
- TemplateEditStructureSelectionManager Context (functions to support keyboard selection/navigation on node list)
- Custom hook useTemplateStructureEditor (slot mutations - add, modify, etc.)

### Slot Tree Retrieval/Cache

The Slot Tree data is retrieved/cached through the RTK Query API definition (can be found at: **src\services\slot.ts**)

- It stores the Slot Tree slots in a adjacency matrix (to make lookups more efficient)
- For slot mutations, the following is done to reduce amount of work required by backend
  - Once a mutation is successful (creation, reposition, etc.), it removes the cached values of affected slots
  - On trigger for re-fetch of slot tree, it will only fill in the missing cache pieces instead of re-fetching everything

### Node Management Contexts

Contexts are used to store React V-Tree node, selection, keyboard selection/navigation states and related functions to limit prop drilling
As the states are stored as refs, to trigger component re-renders each of the states have an observable object attached, with the subscribing component using the useObserver() hook
The node management related files are:

- TemplateEditStructureNodeManager (can be found at: **src\components\templateEdit\structure\TemplateEditStructureNodeManager.tsx**)
- TemplateEditStructureSelectionManager (can be found at: **src\components\templateEdit\structure\TemplateEditStructureSelectionManager.tsx**)
- useObserver (can be found at: **src\hooks\useObserver.ts**)

### Slot Updates

All slot update actions are provided by the hook **useTemplateStructureEditor** and can be found at: **src\hooks\template\mutation\useTemplateStructureEditor.tsx**

From the command bar you are able to Add clause, Add/Edit a constraint, Open the panel for the clause and Delete the clause

### Green dots - Should Clause in preview based on constraints

## Add clause

On the template edit structure tab, there is a button to add clauses to the template. The implementation involves integration of react-dnd with fluent ui detaillist.

The components involved in this implementations are:

- AddClausePanel.tsx
- ClauseList.tsx
- ClauseRow.tsx

Context used:

- TemplateEditStructureNodeManager

Hooks used:

- useTemplateStructureEditor.tsx
- useObserver.ts

**onRenderRow** method of detaillist component renders each row of the detail list. **useDrag** hook from react dnd is used to perform all the drag and drop actions across the add clause panel and template slots.

## Edit constraint

On the template edit structure tab, there is a button to add/edit constraints on the template.

The components involved in this implementation are:

- ConstraintEditPanel.tsx
- ConstraintAdder.tsx
- ConstraintEditList.tsx
- ConstraintEditListItem.tsx

### ConstraintEditPanel.tsx

For consistency we use the layerprops option for the panel to tie it to the hostId `TemplateEditStructureLayer` also need to add the additional `onLayerWillUnmount` and `onLayerDidMount` props to stop a glitched rendering of the scrollbar

```
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
```

### ConstraintAdder.tsx

This component is a button that on press changes into a combobox. When a constraint is selected then that value is passed up to the ConstraintEditPanel and the UsedConstraints array is updated. Theefore when the list of constraints is re-rendered then the used constraints would be disabled.

### ConstraintEditList.tsx

This component just loops through the constraints selected and adds an AND if necessary

### ConstraintEditListItem.tsx

...

## Open clause

Here we call the `useTemplateEditPanelManager.tsx` hook to open the clause panel using the `useClausePanel.tsx` hook. Shold be the same as hitting edit in the Clause layout view.
