import { ItemplatePreviewConfig } from "models/templateMutation";
import { useDispatch } from "react-redux";
import { templateEditPreviewActions } from "store/templateEditPreviewSlice";

const useTemplatePreview = () => {
  const dispatch = useDispatch();

  const setConfig = (config: ItemplatePreviewConfig) => {
    const { languagelocale, asofdate, context, IncludeTestRevision } = config;
    dispatch(
      templateEditPreviewActions.setPreviewConfig({
        languagelocale,
        asofdate,
        context,
        IncludeTestRevision,
      })
    );
  };

  const resetConfig = () => {
    const initDate = new Date();
    dispatch(
      templateEditPreviewActions.setPreviewConfig({
        languagelocale: "en-us",
        asofdate: initDate.toISOString(),
        context: {},
        IncludeTestRevision: false,
      })
    );
  };

  return { setConfig, resetConfig };
};

export default useTemplatePreview;
