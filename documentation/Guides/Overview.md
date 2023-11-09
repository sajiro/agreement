# Overview

Agreement Center is an app that you can use to add clauses and build out templates that other apps can consume.

On the main screen you have the ability to switch between Clauses, Templates, Custom Clauses and Constraints.

For each of these agreement objects you are able to view and search for a specific agreement item, add a new agreement item, edit that agreement item. You can also delete the items except for custom clauses.

## Business Units

Different areas of the business will be able to view,add and publish clauses and templates specific to their business unit

- Professional Services
- OEM
- Modern Commerce

Any super users would be able to go switch between each business unit

## Layout Page

This is the landing page of the app with Clauses selected by default. Each tab will render a detailed list for each agreement object.

### Clauses

[Go to Clauses section](../Technical-Designs/Clauses.md)

### CustomClauses

[Go to CustomClause section](../Technical-Designs/CustomClauses.md)

### Templates

[Go to Templates section](../Technical-Designs/Templates.md)

### Constraints

[Go to Constraints section](../Technical-Designs/Constraints.md)

## Template Edit

This is the page of the app you visit when you want to edit a template

[Go to Template Edit section](../Technical-Designs/TemplateStructureEdit.md)

## Important Information

### Calculated Statuses

The server only deals with 3 statuses: Draft, Test and Published

In our UI to be more helpful to the user we added some 'calculated statuses'

These are figured out in the `setRevisionStatuses` function in `src\helpers\revisions.ts`.

```
export const setRevisionStatuses = (revisions: IRevision[]) => {
  const isAllDraft =
    revisions.length > 0 &&
    revisions.every((r) => r.status === RevisionStatus.Draft);
  const latestPublishedRevision = getLatestPublishedRevision(revisions);
  revisions.forEach((r) => {
    const isPublished = r.status === RevisionStatus.Published;
    const isActive =
      new Date(r.effectiveDate).getTime() <= new Date().getTime();

    if (isAllDraft) r.status = RevisionStatus.Unpublished;
    else if (isPublished && !isActive) r.status = RevisionStatus.Pending;
    else if (
      isPublished &&
      latestPublishedRevision &&
      latestPublishedRevision.id === r.id
    )
      r.status = RevisionStatus.Live;
    else if (
      isPublished &&
      latestPublishedRevision &&
      latestPublishedRevision.id !== r.id
    )
      r.status = RevisionStatus.Old;
  });
};
```

Here we work out Published, Pending, Live and Old to correspond with rules provided in this figma [Statuses](https://www.figma.com/proto/hpWdhnEsdysA0iiCqDwVv8/Port-to-Dynamics?node-id=260%3A23617&scaling=min-zoom&page-id=260%3A23617&starting-point-node-id=276%3A24161&show-proto-sidebar=1)

### Published Dates

When we publish we are setting the 'Effective' date to be at least 2 days ahead at 12.00 am UTC time. We show the publish dates in the info card and revision/status button as local time so for PST it will take away 7hrs so it will show as being published the next day. When we put a Clause in 'Test' mode we set the 'effectiveDate' to be that same day with zeroed out time. This is so when you preview the template the preview date there is set for that day with zeroed out time too so toggling the test status will show the 'Test' clause.
