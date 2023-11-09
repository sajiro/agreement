import { RouteComponent } from "router";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { AgreementObjectEditState } from "models/agreements";
import { useGetAllClausesQuery } from "services/clause";
import ListingsLayout from "components/shared/ListingsLayout";
import { PanelType } from "models/panel";
import { Link } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import usePanel from "hooks/usePanel";
import stringsConst from "consts/strings";
import {
  getRevisionStatusDisplayName,
  getRevisionStatusStyle,
} from "helpers/revisions";
import { useTrackingContext } from "components/shared/TrackingContext";
import ClauseInfo from "./ClauseInfo";

const LinkStyles = {
  color: customTheme.bodyColor,
};

// eslint-disable-next-line react/function-component-definition
const Clauses = () => {
  const { openPanel: openClausePanel } = usePanel(PanelType.Clause);

  const { trackEvent } = useTrackingContext();

  const listingColumns: IColumn[] = [
    {
      key: stringsConst.common.listings.nameKey,
      name: stringsConst.common.listings.nameValue,
      fieldName: stringsConst.common.listings.nameKey,
      minWidth: 220,
      maxWidth: 450,
      // eslint-disable-next-line react/no-unstable-nested-components
      onRender: (item: any) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          title={item.name}
          key={item.key}
          style={LinkStyles}
          onClick={() => openClausePanel({ clauseId: item.key })}
        >
          {item.name}
        </Link>
      ),
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
      type={RouteComponent.Clauses}
      useGetAllQuery={useGetAllClausesQuery}
      InfoComponent={ClauseInfo}
      addNew={() => {
        openClausePanel({}, AgreementObjectEditState.NewClause);
        trackEvent("Add new clause button clicked");
      }}
      searchBoxWidth="230px"
    />
  );
};

export default Clauses;
