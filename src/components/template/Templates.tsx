import { Link } from "@fluentui/react";
import { IColumn } from "@fluentui/react/lib/DetailsList";

import ListingsLayout from "components/shared/ListingsLayout";
import customTheme from "helpers/customTheme";
import {
  getRevisionStatusDisplayName,
  getRevisionStatusStyle,
} from "helpers/revisions";
import useTemplatePanel from "hooks/template/useTemplatePanel";
import useRouter from "hooks/useRouter";
import { useTrackingContext } from "components/shared/TrackingContext";
import { RouteComponent, routeDefinitions } from "router";
import { TemplateEditState } from "models/templatePanel";
import { useGetAllTemplatesQuery } from "services/template";
import stringsConst from "consts/strings";
import TemplateInfo from "./TemplateInfo";

const LinkStyles = {
  color: customTheme.bodyColor,
};

// eslint-disable-next-line react/function-component-definition
const Templates = () => {
  const { goToRoute } = useRouter();
  const { openPanel: openTemplatePanel } = useTemplatePanel();
  const { trackEvent } = useTrackingContext();

  const listingColumns: IColumn[] = [
    {
      key: stringsConst.common.listings.nameKey,
      name: stringsConst.common.template,
      fieldName: stringsConst.common.listings.nameKey,
      minWidth: 220,
      maxWidth: 350,
      // eslint-disable-next-line react/no-unstable-nested-components
      onRender: (item: any) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          title={item.name}
          key={item.key}
          style={LinkStyles}
          onClick={() =>
            goToRoute(
              routeDefinitions.TemplateEdit.getRouteInfo({
                templateId: item.key,
              })
            )
          }
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: stringsConst.common.listings.descriptionKey,
      name: stringsConst.common.listings.descriptionValue,
      fieldName: stringsConst.common.listings.descriptionKey,
      minWidth: 200,
      maxWidth: 380,
    },
    {
      key: stringsConst.common.listings.statusKey,
      name: stringsConst.common.listings.statusValue,
      fieldName: stringsConst.common.listings.statusKey,
      minWidth: 60,
      maxWidth: 60,
      // eslint-disable-next-line react/no-unstable-nested-components
      onRender: (item: any) => (
        <span style={getRevisionStatusStyle(item.status)}>
          {getRevisionStatusDisplayName(item.status)}
        </span>
      ),
    },
  ];

  return (
    <ListingsLayout
      listingColumns={listingColumns}
      type={RouteComponent.Templates}
      useGetAllQuery={useGetAllTemplatesQuery}
      InfoComponent={TemplateInfo}
      addNew={() => {
        openTemplatePanel(undefined, undefined, TemplateEditState.NewTemplate);
        trackEvent("Add new template");
      }}
      searchBoxWidth="250px"
    />
  );
};

export default Templates;
