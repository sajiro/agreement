The app uses a tenant header assigned in `src\services\baseQuery.ts` to segregate the different Business Units.

Roles are assigned using CCF and returned in the call `src\services\businessUnit.ts`. If users are getting 403 errors with a message saying they do not have the correct role/access then they need to reach out and ask to be added.
