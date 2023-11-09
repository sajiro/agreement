# Setup

## Install Dependencies:

- Node.js

Recommend installing the lts of node version 16

Download node version manager to help find that version - https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows

```bash
npm ci --legacy-peer-deps
```

## VSTS package feed issues. (if npm is failing with a 401 error)

To setup credentials run the following:

```bash
npm install -g vsts-npm-auth -F --registry https://registry.npmjs.com --always-auth false
```

```bash
vsts-npm-auth -F -config .npmrc
```

## Certificate Warnings

1. Update your HOSTS (C:\Windows\System32\drivers\etc\hosts) file, add:
   - 127.0.0.1 poc.dev.microsoft.com

## Run project locally as stand alone react app

```bash
npm run start
```

May take a little while on first run possibly over 5 minutes but it will work and then visit https://poc.dev.microsoft.com/ to check react app is running.

Any subsequent saves should check for typescript and lint errors. We have some general lint and prettier configs at the root.

## Run this build to work in MSX environment locally - will need a manual refresh to see changes

https://msxplatform.crm.dynamics.com/main.aspx?appid=dc6b28fe-62ee-e811-a83d-000d3a309c3d&forceUCI=1&pagetype=custom&name=cr8a5_standardclauses_ea27b

```bash
node ./devserver.js
# separate terminal
npm run watch
```

## Test Tooling

1. `npm run test` to run
2. You can use the recommended [Jest Extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

See [Testing.md](./Testing.md) for more information.

## Additional tips for the App

Due to some server sync issues with Service team we needed to add some checks in our service funtions before returning the data. For example, we would get back a success status when updating a clause but then occasionally the rehydration call would include stale data. So where you see the `baseQueryWithRetry` it means we are doing a secondary check to make sure the server is up to date.

For example, here we are creating a new revision and have a `POST` call to create it. To verify that the revision is created we use the information returned from the `POST` call and then do a `GET` call checking the revision exists on the server. We do a max of 2 retries and if we confirm it exists then proceed and return the data.

```
 const newRevisionInfo = createRevisionInfo.revisionProperties;
        const createRevisionRequest = {
          ...newRevisionInfo,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };
        const createRevisionResponse = await baseQueryAgr({
          url: `template/${createRevisionInfo.templateId}/revision`,
          method: "POST",
          body: createRevisionRequest,
        });

        if (createRevisionResponse.data) {
          const createdRevision = createRevisionResponse.data as {
            id: string;
            etag: string;
          };
          createdRevision.etag =
            createRevisionResponse.meta?.response?.headers.get(
              "etag"
            ) as string;
          const verificationResult = await baseQueryWithRetry(
            {
              url: `template/${createRevisionInfo.templateId}/revision/${createdRevision.id}`,
              method: "GET",
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: createdRevision };
        }
```

## Figmas used for the project

[Main Project](https://www.figma.com/file/hpWdhnEsdysA0iiCqDwVv8/Port-to-Dynamics?node-id=1490%3A27486)

[Extra Specs](https://www.figma.com/file/hpWdhnEsdysA0iiCqDwVv8/Port-to-Dynamics?node-id=260%3A23617)

[UX Specs](https://www.figma.com/file/xYbjqYRhnbq2CcCGKrZsLO/Agreement-Center?node-id=0%3A1)
