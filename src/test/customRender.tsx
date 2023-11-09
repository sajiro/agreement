import { EnhancedStore } from "@reduxjs/toolkit"; // for redux-toolkit
// import { Store } from 'redux' // for non-toolkit
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import { RootState } from "../store";
import { storeFactory } from "./testUtils";

type ReduxRenderOptions = {
  preloadedState?: RootState;
  store?: EnhancedStore; // for redux-toolkit
  // store?: Store // for non-toolkit
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

function render(
  ui: ReactElement,
  {
    preloadedState,
    store = storeFactory(preloadedState),
    ...renderOptions
  }: ReduxRenderOptions = {}
): RenderResult {
  function Wrapper({ children }: { children?: ReactNode }): ReactElement {
    const history = createMemoryHistory();

    return (
      <Router history={history}>
        <Provider store={store}>{children}</Provider>
      </Router>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
