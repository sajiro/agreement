import { IConstraintValue } from "models/constraints";
import { rest } from "msw";

export const handlers = [
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/publishedparts",
    (req, res, ctx) => {
      const mockApiResponse = [
        {
          name: "MPSA Amendment Header",
          id: "47c6ff90-d5d1-4afe-bea1-77ebbc29c496",
          revisionsUri:
            "https://template.int.l2o.microsoft.com/v1/ui/part/47c6ff90-d5d1-4afe-bea1-77ebbc29c496/revisions",
          description: "MPSA Amendment Header",
          category: "Header/Footer",
          createdBy: "padmay@microsoft.com",
          createdDate: "2018-03-06T23:12:37Z",
          modifiedBy: "kasub@microsoft.com",
          modifiedDate: "2022-01-06T00:44:09Z",
        },
        {
          name: "Mandatory_Amendment_Opening_MPSA_AMEND_2016May",
          id: "5a08baeb-acdf-4adf-a8df-da61b1c5df26",
          revisionsUri:
            "https://template.int.l2o.microsoft.com/v1/ui/part/5a08baeb-acdf-4adf-a8df-da61b1c5df26/revisions",
          description: "Mandatory_Amendment_Opening_MPSA_AMEND_2016May",
          category: "Content",
          createdBy: "https://microsoft.onmicrosoft.com/L2O",
          createdDate: "2018-01-09T23:32:03Z",
          modifiedBy: "https://microsoft.onmicrosoft.com/L2O",
          modifiedDate: "2018-01-09T23:32:03Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/constraints",
    (req, res, ctx) => {
      const mockApiResponse: any[] = [];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/constraint/21ba8270-d5a2-4965-b41f-9c600ce89716/values",
    (req, res, ctx) => {
      const mockApiResponse: any[] = [
        {
          name: "Blah 1",
          display: "test 1",
          id: "eba5f8ff-11c0-421e-9026-f66289aca46b",
          inUse: true,
          createdBy: "tzegoh@microsoft.com",
          createdDate: "2022-04-14T23:34:56.1204485Z",
          modifiedBy: "tzegoh@microsoft.com",
          modifiedDate: "2022-04-14T23:34:56.1204485Z",
        },
        {
          name: "Blah 2",
          display: "test 2",
          id: "07dd0db2-b01f-4278-b680-f9ed5cc38cc3",
          inUse: true,
          createdBy: "tzegoh@microsoft.com",
          createdDate: "2022-04-14T23:34:56.1204485Z",
          modifiedBy: "tzegoh@microsoft.com",
          modifiedDate: "2022-04-14T23:34:56.1204485Z",
        },
        {
          name: "Blah 3",
          display: "test 3",
          id: "45ef11d6-7bf0-42ac-8bec-f736be03fc2d",
          inUse: true,
          createdBy: "tzegoh@microsoft.com",
          createdDate: "2022-04-14T23:34:56.1204485Z",
          modifiedBy: "tzegoh@microsoft.com",
          modifiedDate: "2022-04-14T23:34:56.1204485Z",
        },
        {
          name: "Test 4",
          display: "Blah 4",
          id: "e393f6f3-114a-49db-8c44-5f35bceee84f",
          inUse: true,
          createdBy: "tzegoh@microsoft.com",
          createdDate: "2022-04-14T23:35:30.2094939Z",
          modifiedBy: "tzegoh@microsoft.com",
          modifiedDate: "2022-04-14T23:35:30.2094939Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/",
    (req, res, ctx) => {
      const mockApiResponse: any[] = [
        {
          id: "8425da46-2ae9-4e96-b033-48edd4aedea3",
          name: "",
          position: 1073741823,
          partId: "47c6ff90-d5d1-4afe-bea1-77ebbc29c496",
          partName: "MPSA Amendment Header",
          category: "Header/Footer",
          constraints: [
            {
              keyId: "21ba8270-d5a2-4965-b41f-9c600ce89716",
              key: "AppLawTest555",
              keyDisplay: "Applicable Law",
              value: "Blah 1",
              valueDisplay: "test 1",
              operator: "Include",
            },
            {
              keyId: "fda34965-6434-498e-b6fc-5c5e4d3e87b1",
              key: "HasConsultingTMPackages",
              keyDisplay: "Has Consulting TM Packages",
              value: "true",
              valueDisplay: "true",
              operator: "Include",
            },
          ],
          slots: [],
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-07T20:32:35Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-07T21:08:17Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/constraint/fda34965-6434-498e-b6fc-5c5e4d3e87b1/values",
    (req, res, ctx) => {
      const mockApiResponse: any[] = [
        [
          {
            name: "true",
            display: "true",
            id: "03b29b28-5293-494d-85e0-c44d5750ad1c",
            inUse: true,
            createdBy: "https://microsoft.onmicrosoft.com/agreementserviceppe",
            createdDate: "2021-10-27T16:32:43.9627549Z",
            modifiedBy: "https://microsoft.onmicrosoft.com/agreementserviceppe",
            modifiedDate: "2021-10-27T16:32:43.9627549Z"
          }
        ]
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/8425da46-2ae9-4e96-b033-48edd4aedea3",
    (req, res, ctx) => {
      const mockApiResponse: any = {
        id: "8425da46-2ae9-4e96-b033-48edd4aedea3",
        name: "",
        position: 1073741823,
        partId: "47c6ff90-d5d1-4afe-bea1-77ebbc29c496",
        partName: "MPSA Amendment Header",
        category: "Header/Footer",
        constraints: [
          {
            keyId: "21ba8270-d5a2-4965-b41f-9c600ce89716",
            key: "AppLawTest555",
            keyDisplay: "Applicable Law",
            value: "Blah 1",
            valueDisplay: "test 1",
            operator: "Include",
          },
          {
            keyId: "fda34965-6434-498e-b6fc-5c5e4d3e87b1",
            key: "HasConsultingTMPackages",
            keyDisplay: "Has Consulting TM Packages",
            value: "true",
            valueDisplay: "true",
            operator: "Include",
          },
        ],
        slots: [],
        createdBy: "v-dweavers@microsoft.com",
        createdDate: "2022-06-07T20:32:35Z",
        modifiedBy: "v-dweavers@microsoft.com",
        modifiedDate: "2022-06-07T21:08:17Z",
      };

      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/template/111/revision/222/slots/",
    (req, res, ctx) => {
      const mockApiResponse: any = "";
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/template/111/revision/222/slots",
    (req, res, ctx) => {
      const mockApiResponse: any = "";
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/template/6fc1486f-6c1d-47ee-ba8b-74368a019289/revision/bf1c3a26-8519-4c89-bfe1-527c700c056c/slots",
    (req, res, ctx) => {
      const mockApiResponse: any[] = [
        {
          id: "f4e96752-685f-4c31-a001-b2519f3eb1a2",
          name: "",
          position: 1073741823,
          partId: "3d234a08-58c7-4414-b00e-1a31d1003afd",
          partName: "TestClauseACV2EffDate",
          category: "Content",
          constraints: [],
          slots: [],
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-10T23:34:33Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-10T23:34:33Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revisions",
    (req, res, ctx) => {
      const mockApiResponse: any = [
        {
          contentsUri:
            "https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0/contents",
          id: "09bbd9ab-081b-4948-ae6b-237ac2a84de0",
          name: "",
          effectiveDate: "2022-06-12T07:00:00Z",
          status: "Published",
          displayOption: "Default",
          number: 4,
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-10T23:42:42Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-10T23:42:49Z",
        },
        {
          contentsUri:
            "https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e/contents",
          id: "b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e",
          name: "",
          effectiveDate: "2022-06-12T07:00:00Z",
          status: "Published",
          displayOption: "Default",
          number: 3,
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-10T23:40:45Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-10T23:46:21Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0",
    (req, res, ctx) => {
      const mockApiResponse: any = [
        {
          contentsUri:
            "https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0/contents",
          id: "09bbd9ab-081b-4948-ae6b-237ac2a84de0",
          name: "",
          effectiveDate: "2022-06-12T07:00:00Z",
          status: "Published",
          displayOption: "Default",
          number: 4,
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-10T23:42:42Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-10T23:42:49Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e",
    (req, res, ctx) => {
      const mockApiResponse: any = [
        {
          contentsUri:
            "https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e/contents",
          id: "b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e",
          name: "",
          effectiveDate: "2022-06-12T07:00:00Z",
          status: "Published",
          displayOption: "Default",
          number: 3,
          createdBy: "v-dweavers@microsoft.com",
          createdDate: "2022-06-10T23:40:45Z",
          modifiedBy: "v-dweavers@microsoft.com",
          modifiedDate: "2022-06-10T23:46:21Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0/contents",
    (req, res, ctx) => {
      const mockApiResponse: any = [
        {
          language: "de-de",
          length: 12448,
          disposition:
            "attachment; filename*=UTF-8''TestClauseACV2EffDate%283d234a08-58c7-4414-b00e-1a31d1003afd%29__%2809bbd9ab-081b-4948-ae6b-237ac2a84de0%29__de-de.docx",
          contents: {},
          lastModified: "2022-06-10T23:42:42Z",
          status: "Unknown",
          sasUri:
            "https://l2otemplateintcy4.blob.core.windows.net/templatescontainer/Part/3d234a08-58c7-4414-b00e-1a31d1003afd/de-de/09bbd9ab-081b-4948-ae6b-237ac2a84de0?sv=2016-05-31&sr=b&sig=%2Ftg%2BFgbrwTvuli%2BEC9TPYqV8w5na4rJYm8ChSn8FmU4%3D&st=2022-06-11T00%3A35%3A49Z&se=2022-06-11T00%3A41%3A49Z&sp=r",
          sasExpiration: "2022-06-11T00:41:49.7160629Z",
        },
        {
          language: "fi-fi",
          length: 12496,
          disposition:
            "attachment; filename*=UTF-8''TestClauseACV2EffDate%283d234a08-58c7-4414-b00e-1a31d1003afd%29__%2809bbd9ab-081b-4948-ae6b-237ac2a84de0%29__fi-fi.docx",
          contents: {},
          lastModified: "2022-06-10T23:42:43Z",
          status: "Unknown",
          sasUri:
            "https://l2otemplateintcy4.blob.core.windows.net/templatescontainer/Part/3d234a08-58c7-4414-b00e-1a31d1003afd/fi-fi/09bbd9ab-081b-4948-ae6b-237ac2a84de0?sv=2016-05-31&sr=b&sig=xTSosTKM%2Ft%2BbuybHlmTuOsg4VmoenTE%2FMdIkj3QlcEM%3D&st=2022-06-11T00%3A35%3A49Z&se=2022-06-11T00%3A41%3A49Z&sp=r",
          sasExpiration: "2022-06-11T00:41:49.7160629Z",
        },
      ];
      return res(ctx.json(mockApiResponse));
    }
  ),
];

export const getConstraintMockApi = () => (
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/constraint/1ab1442a-f470-4c16-a96b-db6cfedda47b",
    (req, res, ctx) => {
      const mockApiResponse = {
        "name": "Test",
        "display": "test",
        "id": "1ab1442a-f470-4c16-a96b-db6cfedda47b",
        "valuesUri": "https://template.int.l2o.microsoft.com/v1/constraint/1ab1442a-f470-4c16-a96b-db6cfedda47b/values",
        "createdBy": "v-erwinde@microsoft.com",
        "createdDate": "2022-04-07T17:07:49Z",
        "modifiedBy": "v-erwinde@microsoft.com",
        "modifiedDate": "2022-04-07T17:07:49Z"
      };
      return res(ctx.json(mockApiResponse));
    }
  )
);

export const getConstraintValuesMockApi = (constraintValues: IConstraintValue[]) => (
  rest.get(
    "https://template.int.l2o.microsoft.com/v1/ui/constraint/1ab1442a-f470-4c16-a96b-db6cfedda47b/values",
    (req, res, ctx) => res(ctx.json(constraintValues))
  )
);