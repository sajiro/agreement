# Testing

## Jest with React Testing Library

Use jest and react testing library for any unit testing. Test files are all in typescript too.

Added the tests at the same level as the individual component/helper file

The [Setup File](../src\setupTests.ts) is set up as follows:

We need to initializeIcons() beforeAll to avoid warnings about icons not being initialized in the terminal.
For some components we directly call an RTKQuery hook and RTKQuery recommends mocking the API instead of using jest to mock.
Username phry is the main RTKQuery contributor and makes that suggestion [here](https://stackoverflow.com/a/70313785).
So we use a [mock service worker](https://mswjs.io/) and that is setup here `../src\test\server\index.ts`. In the `src\test\server\serverHandlers.ts` file we add all the apis we want to mock in the handlers array.

This is called in the setup file using `server.listen({ onUnhandledRequest: "bypass" })` we have bypass set as there are a few tests that render the whole app but we just want to check it is loading ok and we don't want warnings about unmocked apis in the nested components. When adding new tests it is helpful to update `bypass` to `error` to see if your test requires any api mocking.

In the tests themselves if any redux state is involved in the component then we need to use a modified version of the `render` function from React Testing Library.

`import { render, screen } from "test/customRender"`

In `/src\test\customRender.tsx` we add a Provider around the component and pass in the store information.

We want to be able to add our own store values in our tests

```
  {
    preloadedState,
    store = storeFactory(preloadedState),
    ...renderOptions
  }: ReduxRenderOptions = {}
```

so we need to add a preloadState object when we create our test. We have a function for the store in `./testUtils` which should match the main app's store - if you add something new to the main app store you will need to add it in this file too - but has the preloadedState property added to it so updates the store values for whichever redux slice we specify

```
    render(<SharedNotification />, {
      preloadedState: {
        templateEdit: {
          isLoading: false,
          messageInfo: {
            message: "Message goes here",
            type: MessageBarType.success,
          },
        },
      } as RootState,
    });
```

If you don't want to add any redux state but want to test a component that is affected by redux state you would just add this

```
render(<TemplateEdit {...props} />, {
      preloadedState: {} as RootState,
    });
```

We use useLocation in our `useRouter.ts` hook so we need to add in a Router wrapper too

```
    const history = createMemoryHistory();

    return (
      <Router history={history}>
        <Provider store={store}>{children}</Provider>
      </Router>
    );
```

## Selenium

Use for automation testing

See the [READ ME](../selenium\README.md) for more infomation on how to set up and use
