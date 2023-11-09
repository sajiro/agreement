import { Observable } from "components/shared/nodes/Observable";
import { useEffect, useRef } from "react";
import { useRefresh } from "./useRefresh";

const useObserver = (observable: Observable) => {
  const observerIdRef = useRef<string>();
  const [refreshToken, refresh] = useRefresh();

  useEffect(() => (
    () => {
      observable.removeObserver(observerIdRef.current!);
    }
  ), []);

  if (!observerIdRef.current) {
    observerIdRef.current = observable.addObserver(refresh);
  }

  return refreshToken;
};

export default useObserver;