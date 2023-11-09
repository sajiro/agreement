# Redux

Used across the application to manage state globally, so:
- Easier to debug (trace, inspect, test, etc. state of application via Redux DevTools)
- Easier to manage/share state across components (minimize prop drilling)

## RTK

RTK (Redux Tool Kit) is a package by the authors of Redux and built on top of it. The main advantages of the package are:
- Simplification of Redux store configuration/usage
- Reduction of amount of duplicate code 

## RTK Query

Included within RTK is an additional tool called RTK Query, which integrates data fetching/caching directly into Redux and allows for:
- Automated cache management support
- Encapsulation of async nature of API logic into component consumable format 

## Reference

[RTK](https://redux-toolkit.js.org/introduction/getting-started)
[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

## Usage

RTK Query is designed so that the global store is configured/comprised of sub-states and reducers.
The way the sub-states/reducers get defined are as follows:
- Slice: combination of a sub-state and it's corresponding reducers
- API: API call definitions (queries, mutations, cache manipulations)
- NOTE: API definition related states are not apart of the exported RootState type definition and are only accessible via the generated associated hooks

### Slices

RTK Slices are wrappers/encapsulation around setting up a redux store and its corresponding reducers.
Slices for this project can be found in **src\store**
Below is an example slice definition pulled from the project

```
// Sub-state type definition
const initialState: IPanelSlice = { panelType: undefined, agreementObjectIds: {}, additionalInfo: {}, persistentInfo: {} };

// Slice object (combination of state and reducers) that will be imported/used by the global store
export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    setPanel(state: WritableDraft<IPanelSlice>, action: PayloadAction<IPanel>) {
      return { ...state, ...action.payload };
    },
    updateCache(state: WritableDraft<IPanelSlice>, action: PayloadAction<{key: string; value: any; }>) {
      state.persistentInfo[action.payload.key] = action.payload.value;
    },
    closePanel(state: WritableDraft<IPanelSlice>) {
      state.panelType = undefined;
    }
  }
});

// Auto generated actions creator function that create the action objects for each reducer
export const panelActions = panelSlice.actions;
```

### API

RTK APIs are wrappers/encapsulations for a set of endpoints (queries and mutations) on a set of data
By default the query endpoint data is auto cached in redux (triggered/retrieved via auto generated hooks)
Also has built in support to invalidate/trigger an auto refetch if the data was modified via a mutation
Below is an example API definition pulled from the project

```
// API object that will be imported/used by the global store 
export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery,
  tagTypes: ["getSavedTags"], // Used to label cached data so that mutations can invalidate/force a refetch on that data
  endpoints: (builder) => ({
    getTags: builder.query<ITagsData[] | undefined, { id?: string }>({
      query: ({ id }) => `/labels?_=${id}`,
      transformResponse: (response: ITagsData[]) => response || [],
    }),
    getSavedTags: builder.query<
      ITagsData[] | undefined,
      { templateId?: string }
    >({
      query: ({ templateId }) => `/template/${templateId}/labels`,
      transformResponse: (response: ITagsData[]) => response || [],

      // Sets the data retrieved via this endpoint will the tag (label)
      providesTags: (_result, _error, arg) => [
        { type: "getSavedTags", id: arg.templateId },
      ],
    }),
    saveTags: builder.mutation<{ id: string }, ICreateTagsRequest>({
      queryFn: async (
        tagsInfoRequestBody,
        _api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const saveTagsResponse = await baseQueryAgr({
          url: `/template/${tagsInfoRequestBody.templateId}/label`,
          method: "POST",
          body: { id: tagsInfoRequestBody.id, name: tagsInfoRequestBody.name },
        });
        if (saveTagsResponse.data) {
          const addedTag = saveTagsResponse.data as { id: string };
          return { data: addedTag };
        }
        return { error: saveTagsResponse.error! };
      },

      // Instructs RTK Query to force a refetch on the data with tag (label)
      invalidatesTags: [{ type: "getSavedTags" }],
    }),
    deleteTags: builder.mutation<{ id: string }, ICreateTagsRequest>({
      queryFn: async (
        tagsInfoRequestBody,
        _api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const deleteTagsResponse = await baseQueryAgr({
          url: `/template/${tagsInfoRequestBody.templateId}/label/${tagsInfoRequestBody.labelId}`,
          method: "DELETE",
        });
        if (deleteTagsResponse.data) {
          const deleteTag = deleteTagsResponse.data as { id: string };
          return { data: deleteTag };
        }

        return { error: deleteTagsResponse.error! };
      },
      invalidatesTags: [{ type: "getSavedTags" }],
    }),
  }),
});

// Exports the auto generated hooks from the API defined above
export const {
  useGetTagsQuery,
  useGetSavedTagsQuery,
  useSaveTagsMutation,
  useDeleteTagsMutation,
} = tagsApi;
```

### Store

Using the API and Slice definitions, they can be combined into a global Redux store definition
Below is an example, pulled from the project

```
// The Redux Store's state will be an object with property names as each Slice/API's name/reducer path and the value being each of the sub slice's type definition
const store = configureStore({
  reducer: {
    [panelSlice.name]: panelSlice.reducer,
    [clausePanelFormsSlice.name]: clausePanelFormsSlice.reducer,
    [customClausePanelFormsSlice.name]: customClausePanelFormsSlice.reducer,
    [panelMessagesSlice.name]: panelMessagesSlice.reducer,
    [clauseApi.reducerPath]: clauseApi.reducer,
    [customClauseApi.reducerPath]: customClauseApi.reducer,
    [constraintApi.reducerPath]: constraintApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
    [slotApi.reducerPath]: slotApi.reducer,
    [dialogSlice.name]: dialogSlice.reducer,
    [contentPlaceholdersSlice.name]: contentPlaceholdersSlice.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [templateFormsSlice.name]: templateFormsSlice.reducer,
    [previewApi.reducerPath]: previewApi.reducer,
    [templateEditPreviewSlice.name]: templateEditPreviewSlice.reducer,
    [ccfBusinessGroupApi.reducerPath]: ccfBusinessGroupApi.reducer,
    [businessUnitSlice.name]: businessUnitSlice.reducer,
    [templateEditPanelManagementSlice.name]: templateEditPanelManagementSlice.reducer,
    [templateEditSlice.name]: templateEditSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(clauseApi.middleware)
      .concat(customClauseApi.middleware)
      .concat(constraintApi.middleware)
      .concat(templateApi.middleware)
      .concat(slotApi.middleware)
      .concat(tagsApi.middleware)
      .concat(previewApi.middleware)
      .concat(ccfBusinessGroupApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Auto generated Store type that can be used else where in the code with the userSelector() hook
export type RootState = ReturnType<typeof store.getState>;
export default store;
```