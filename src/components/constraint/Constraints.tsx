import { IColumn } from "@fluentui/react";
import ListingsLayout from "components/shared/ListingsLayout";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import { ConstraintEditState } from "models/constraints";
import { RouteComponent } from "router";
import { useGetAllConstraints } from "services/constraint";
import stringsConst from "consts/strings";
import ConstraintInfo from "./ConstraintInfo";

// eslint-disable-next-line react/function-component-definition
const Constraints = () => {
  const { openPanel } = useConstraintPanel();

  const listingColumns: IColumn[] = [
    {
      key: stringsConst.common.listings.nameKey,
      name: stringsConst.common.listings.nameValue,
      fieldName: stringsConst.common.listings.nameKey,
      minWidth: 100,
      maxWidth: 200,
      // eslint-disable-next-line react/no-unstable-nested-components
      onRender: (item: any) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <div title={item.name}>{item.name}</div>
      ),
    },
  ];

  return (
    <ListingsLayout
      listingColumns={listingColumns}
      type={RouteComponent.Constraints}
      useGetAllQuery={useGetAllConstraints}
      InfoComponent={ConstraintInfo}
      addNew={() => {
        openPanel(undefined, ConstraintEditState.New);
        // trackEventClick("Add new constraint");
      }}
      searchBoxWidth="200px"
    />
  );
};

export default Constraints;
