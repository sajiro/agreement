import { ActionButton, IColumn, SearchBox, Stack } from "@fluentui/react";
import useFetchItems from "hooks/useFetchItems";
import { RouteComponent } from "router/index";
import { IAgreementObject, IAgreementObjectId } from "models/agreements";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from "@reduxjs/toolkit/dist/query/react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import StackItem from "components/fluentUI/StackItem";
import DetailsList from "components/fluentUI/DetailsList";
import { getNewClauseName } from "helpers/listingsLayout";
import customTheme from "helpers/customTheme";
import icons from "./Icons";

type ListingsLayoutProps = {
  type: RouteComponent;
  useGetAllQuery: UseQuery<
    QueryDefinition<
      void,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      IAgreementObject[],
      string
    >
  >;
  listingColumns: IColumn[];
  InfoComponent: (props: IAgreementObjectId) => JSX.Element;
  addNew: () => void;
  searchBoxWidth: string;
};
// eslint-disable-next-line
const ListingsLayout = ({
  type,
  useGetAllQuery,
  listingColumns,
  InfoComponent,
  addNew,
  searchBoxWidth,
}: ListingsLayoutProps) => {
  const {
    onFilterChangedHandler,
    setCurrentItem,
    items: filteredItems,
    currentItem,
    isLoading,
  } = useFetchItems(useGetAllQuery, type);

  const buttonStyles = {
    action: {
      root: {
        height: "32px",
        padding: "0px 12px 6px 5px",
      },
      icon: {
        marginRight: "8px",
        color: customTheme.focusColor,
      },
    },
    search: {
      root: {
        border: "none",
        height: "27px",
        marginBottom: "5px",
        width: searchBoxWidth,
      },
    },
  };

  const panelStyles = {
    list: {
      width: "35%",
    },
    info: {
      width: "65%",
      padding: "24px 0 24px 32px",
    },
  };
  if (type === RouteComponent.Templates) {
    panelStyles.list.width = "50%";
    panelStyles.info.width = "50%";
  }
  if (type === RouteComponent.CustomClauses) {
    panelStyles.list.width = "40%";
    panelStyles.info.width = "60%";
  }

  const newClauseName = getNewClauseName(type);

  return (
    <Stack disableShrink role="grid">
      <StackItem borderBottom role="row">
        <Stack disableShrink horizontal>
          <StackItem role="cell" style={{ padding: "0px" }} borderRight>
            <ActionButton
              role="button"
              data-cy="new-type-btn"
              iconProps={icons.add}
              styles={buttonStyles.action}
              onClick={addNew}
            >
              New {newClauseName}
            </ActionButton>
          </StackItem>
          <StackItem style={{ padding: "0px" }} borderLeft>
            <SearchBox
              data-automation-id="listingsLayout-searchBox"
              role="search"
              placeholder="Search"
              onChange={onFilterChangedHandler}
              showIcon
              styles={buttonStyles.search}
            />
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <Stack disableShrink horizontal horizontalAlign="center">
          <StackItem
            dataAutomationId="listingsLayout-list"
            style={panelStyles.list}
            borderRight
            borderTop
          >
            <DetailsList
              columns={listingColumns}
              data={filteredItems}
              onClickItem={setCurrentItem}
              currentItem={currentItem}
              isLoading={isLoading}
            />
          </StackItem>
          <StackItem
            dataAutomationId="listingsLayout-info"
            style={panelStyles.info}
            borderLeft
            borderTop
          >
            <InfoComponent {...currentItem} />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};

export default ListingsLayout;
