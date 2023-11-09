import { Provider } from "react-redux";
import { AppRouter } from "components/AppRouter";
import store from "./store/index";
import "./App.css";

export function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
