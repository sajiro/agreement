import { ILayerProps } from "@fluentui/react";
import { useMemo } from "react";

const useLayerSettings = (
  trapPanel: boolean,
  layerHostId: string
): { Layer?: ILayerProps } =>
  useMemo(() => {
    if (trapPanel) {
      const layerProps: ILayerProps = { hostId: layerHostId };
      return { Layer: layerProps };
    }
    return {};
  }, [trapPanel, layerHostId]);

export default useLayerSettings;
