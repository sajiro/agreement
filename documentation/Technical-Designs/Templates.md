# Templates

The layout works the same as [Clauses](Technical-Designs/Clauses.md) but we show less functionality as there is the Edit Template page which allows you to make any changes to your template. You can only add a new template which opens a panel but after creation you are passed through to the Edit Template page. You do have access to the `SharedActionBar.tsx` so have the ability to switch revisions Delete, Publish or set to Test. Edit will route you to the EditTemplate page.

## Creating new revision of template
Creating a new revision involve creating a copy of the existing version and then copying all the slots to it. If any of the above step fails, dialog will notify the user at which step it is failed.

**SharedActionBar.tsx** is the component having the logic for creating new revision.

Hooks used:
- useTemplateMutationActionTrigger.ts
- useTemplateMutator.ts

Dilog component used:
- ProcessingDialog.tsx
- TemplateCloneFailDialog.tsx