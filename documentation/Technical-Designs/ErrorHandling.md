## The API / User Actions Covered

### 1. Create Clause Revision

**Case 1:**

User X creates revision N+1 based on revision N, but user Y deletes revision N before user X clicks Save.

- If revision N has no translations, show Success dialog; otherwise, show Error 404 dialog from Copy Translations API call, and list the error in the panel message callout.
- Revision N+1 is successfully created, but because the original revision has been deleted, the newly created revision gets the version number N. Clicking Refresh in the Error 404 dialog displays the newly created revision in the right panel.

**Case 2:**

User X tries to create a new revision, but user Y deletes the entire clause before user X clicks Save.

- Show Error 404 dialog. Nothing is created. Clicking Refresh in the dialog refreshes the list of clauses, and the Info panel shows “Nothing selected”.

### 2. Update Clause and Clause Revision

Properties tab (clause properties and revision properties), Translations tab (delete and upload translations)

**Case 1:**

User X tries to update properties and/or delete/upload translations, but user Y deletes the clause before user X clicks Save.

- Show Error 404 dialog. Clicking Refresh in the dialog refreshes the list of clauses, and the info panel shows “Nothing selected”.

**Case 2:**

User X tries to update properties and/or delete/upload translations, but user Y deletes the revision before user X clicks Save.

- Show Error 404 dialog and panel error message. Clicking Refresh in the dialog refreshes the Edit panel, showing the previous revision.

**Case 3:**

User X tries to delete translations, but user Y deletes those same translations before user X clicks Save.

- Show Success dialog

### 3. Test / Publish / Withdraw Revision

**Case 1:**

User X tries to test / publish / withdraw a revision, but user Y deletes the clause before user X clicks Save.

- Show Error 404 dialog. Clicking Refresh in the dialog refreshes the list of clauses, and the info panel shows “Nothing selected”.

**Case 2:**

User X tries to test / publish / withdraw a revision, but user Y deletes the revision before user X clicks Save.

- Show Error 404 dialog. Clicking Refresh in the dialog refreshes the right panel, showing the previous revision.

### 4. Delete Clause/Template and Clause/Template Revision

**Case 1:**

User X tries to delete a clause or a template, but user Y deletes that clause or template before user X clicks Save.

- Show Success dialog

**Case 2:**

User X tries to delete a clause/template revision, but user Y deletes that revision before user X clicks Save.

- Show Success dialog

**Case 3:**

User X tries to delete a clause/template revision, but user Y deletes the entire clause or template before user X clicks Save.

- Show Error 404 dialog. Clicking Refresh in the dialog refreshes the list of clauses or templates, and the info panel shows “Nothing selected”.

### 5. Get Clause

User X selects a clause from the list; the URL in the browser address bar contains the clause ID. User Y deletes the clause, then User X refreshes the browser.

Alternately, someone sends a URL containing clause ID to user X, but user Y deletes the clause before user X opens the URL.

- Show Error 404 dialog. Clicking Refresh in the dialog refreshes the list of clauses, and the info panel shows “Nothing selected”.
