import { Link, mergeStyleSets, Text } from "@fluentui/react";
import UsedInTemplateView from "components/shared/UsedInTemplateView";
import {
  DEFAULT_NON_EXISTING_VALUE_TEXT,
  DEFAULT_TEMPLATE_SHOW_COUNT,
} from "helpers/agreements";
import customTheme from "helpers/customTheme";
import { ITemplate } from "models/templates";
import { useState } from "react";

const styles = mergeStyleSets({
  containerClass: {
    borderBottom: `1px solid ${customTheme.divBorderColor}`,
    paddingBottom: "8px",
    marginBottom: "4px",
  },
  usedInTemplateContainer: {
    ...customTheme.groupedListContainer,
    alignItems: "flex-start",
  },
});

type UsedInTemplateDisplayProp = {
  templateList: ITemplate[] | undefined;
};
function ClauseUsedInTemplateDisplay({
  templateList,
}: UsedInTemplateDisplayProp) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [initialCount, setInitialCount] = useState<number>(
    DEFAULT_TEMPLATE_SHOW_COUNT
  );
  const onExpandCollapseHandler = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    if (!newIsExpanded) {
      setInitialCount(DEFAULT_TEMPLATE_SHOW_COUNT);
    } else {
      setInitialCount(templateList!.length);
    }
  };
  let showMore = false;
  if (templateList) {
    showMore = templateList!.length > initialCount || isExpanded;
  }

  return (
    <div style={{ display: "inline-block" }}>
      {templateList && templateList.length !== 0 ? (
        <div
          className={`${styles.usedInTemplateContainer} ${
            templateList.length > initialCount || isExpanded
              ? styles.containerClass
              : ""
          }`}
        >
          {templateList.slice(0, initialCount)?.map((templates) => (
            <UsedInTemplateView
              key={templates?.id}
              templateId={templates?.id}
              templateName={templates?.name}
            />
          ))}
        </div>
      ) : (
        <Text>{DEFAULT_NON_EXISTING_VALUE_TEXT}</Text>
      )}{" "}
      {showMore && (
        <div>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link onClick={onExpandCollapseHandler}>
            {isExpanded ? "hide" : `show all ${templateList?.length}`}
          </Link>
        </div>
      )}
    </div>
  );
}
export default ClauseUsedInTemplateDisplay;
