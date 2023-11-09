
import { useHistory, useLocation } from "react-router-dom";
import { IRouteInfo } from "router";
import { config } from "config";
import { useCallback, useEffect, useRef } from "react";

const useRouter = () => {
  const history = useHistory();
  const location = useLocation();
  const onRouteChanged = useRef<() => void|undefined>();

  const getUrlFromRouteInfo = useCallback((routeInfo: IRouteInfo) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("data", JSON.stringify(routeInfo));
    return `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
  }, []);

  const goToRoute = useCallback((routeInfo: IRouteInfo) => {
    const url = getUrlFromRouteInfo(routeInfo);
    history.push(url);
  }, [history, getUrlFromRouteInfo]);

  const updateRoute = useCallback((routeInfo: IRouteInfo, onRouteUpdated?: () => void) => {
    const url = getUrlFromRouteInfo(routeInfo);
    history.replace(url);
    onRouteChanged.current = onRouteUpdated;
  }, [history, getUrlFromRouteInfo]);

  const getRouteInfo = useCallback((): IRouteInfo|undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    const rawRouteInfoData = searchParams.get("data");
    if (rawRouteInfoData) {
      const routeInfoJson = decodeURIComponent(rawRouteInfoData);
      return JSON.parse(routeInfoJson);
    }

    return undefined;
  }, []);

  const back = useCallback(() => {
    history.goBack();
  }, [history]);

  const refresh = useCallback(() => {
    history.go(0);
  }, [history]);

  const isMsx = useCallback(() => {
    const currentUrl = new URL(window.location.href);
    return config.msxHostnames.find(hostname => currentUrl.host === hostname) !== undefined;  
  }, []);

  useEffect(() => {
    if (onRouteChanged.current) {
      onRouteChanged.current();
      onRouteChanged.current = undefined;
    }

    // Remove Hash portion of URL if not running in MSX
    // Fix for removing Hash that gets applied to URL by login re-direct
    if (!isMsx() && location.hash) {
      window.location.replace(`${window.location.pathname}${window.location.search}`);
    }
  }, [location, isMsx]);

  return { goToRoute, updateRoute, getRouteInfo, back, refresh, isMsx };
};

export default useRouter