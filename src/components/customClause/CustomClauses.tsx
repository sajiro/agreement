import { RouteComponent } from "router";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { useGetAllCustomClausesQuery } from "services/customClause";
import ListingsLayout from "components/shared/ListingsLayout";
import { Link } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import { AgreementObjectEditState } from "models/agreements";

import usePanel from "hooks/usePanel";
import { PanelType } from "models/panel";
import stringsConst from "consts/strings";
import CustomClauseInfo from "./CustomClauseInfo";

const LinkStyles = {
  color: customTheme.bodyColor,
};

// eslint-disable-next-line react/function-component-definition
const CustomClauses = () => {
  const { openPanel: openCustomClausePanel } = usePanel(PanelType.CustomClause);

  const listingColumns: IColumn[] = [
    {
      key: stringsConst.common.listings.nameKey,
      name: stringsConst.common.customClause,
      fieldName: stringsConst.common.listings.nameKey,
      minWidth: 280,
      maxWidth: 330,
      // eslint-disable-next-line react/no-unstable-nested-components
      onRender: (item: any) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          title={item.name}
          key={item.key}
          style={LinkStyles}
          onClick={() =>
            openCustomClausePanel({
              clauseId: item.key,
              templateId: item.templateId,
            })
          }
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: stringsConst.customClause.CustomClauses.templateKey,
      name: stringsConst.customClause.CustomClauses.templateValue,
      fieldName: stringsConst.customClause.CustomClauses.templateKey,
      minWidth: 250,
      maxWidth: 280,
    },
  ];

  return (
    <ListingsLayout
      listingColumns={listingColumns}
      type={RouteComponent.CustomClauses}
      useGetAllQuery={useGetAllCustomClausesQuery}
      InfoComponent={CustomClauseInfo}
      addNew={() => {
        openCustomClausePanel({}, AgreementObjectEditState.NewClause);
        // trackEventClick("Add new custom clause");
      }}
      searchBoxWidth="250px"
    />
  );
};

export default CustomClauses;
