# Environments

| Environment | Description                                    |
| ----------- | ---------------------------------------------- |
| Local       |                                                |
| PPE         | Manually deployed. Used by test and PM teams.  |
| Prod        | When applicable, redirects to public PROD url. |

## Configs

We have a dev config and production config and these are flagged in `config.ts` based off an ENV setting we pass in the scripts object in `package.json`. Local and Int/PPE use the same version of templates int service so use the same config.

```
    "start": "SET REACT_APP_NODE_ENV=int&&react-scripts start",
    "build:latest": "SET REACT_APP_NODE_ENV=int&&SET PUBLIC_URL=https://agreementcenterv2ppe.azureedge.net&& npm run build:ci",
    "build:prod": "SET REACT_APP_NODE_ENV=prod&&SET PUBLIC_URL=https://agreementcenterv2.azureedge.net&& npm run build:ci",
```
