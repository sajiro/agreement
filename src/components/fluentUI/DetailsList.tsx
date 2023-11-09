import {
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  CheckboxVisibility,
  IDetailsRowProps,
  DetailsRow,
  IDetailsRowStyleProps,
  IDetailsList,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import {
  ScrollablePane,
  IScrollablePaneStyles,
} from "@fluentui/react/lib/ScrollablePane";
import { Sticky, StickyPositionType } from "@fluentui/react/lib/Sticky";
import { IRenderFunction } from "@fluentui/react/lib/Utilities";
import { IDetailsHeaderProps, ShimmeredDetailsList } from "@fluentui/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { IAgreementObject, IAgreementObjectId } from "models/agreements";
import _ from "lodash";
import customTheme from "helpers/customTheme";

const scrollablePaneStyles: Partial<IScrollablePaneStyles> = {
  root: {
    overflowX: "hidden",
  },
  stickyAbove: {
    paddingRight: 32,
  },
  contentContainer: {
    paddingRight: 32,
  },
};

type DetailsListProps = {
  columns: IColumn[];
  data: IAgreementObject[];
  onClickItem: (objectIdInfo: IAgreementObjectId) => void;
  currentItem: IAgreementObjectId | undefined;
  isLoading: boolean;
};

type SelectionManagerArgs = {
  items: IAgreementObject[];
  currentItem: IAgreementObjectId | undefined;
  onClickItem: (objectIdInfo: IAgreementObjectId) => void;
  detailsList: RefObject<IDetailsList>;
};

const useSelection = (
  onClickItem: (objectIdInfo: IAgreementObjectId) => void
) => {
  const [selection] = useState<Selection>(
    new Selection({
      onSelectionChanged: () => {
        const selectedItem = selection.getSelection()[0];
        if (selectedItem) {
          const selectedAgreementObject = selectedItem as IAgreementObject;
          onClickItem(selectedAgreementObject.objectIdInfo);
        }
      },
      selectionMode: SelectionMode.single,
    })
  );

  return selection;
};

const useSelectionManager = (args: SelectionManagerArgs) => {
  const { onClickItem, currentItem, items, detailsList } = args;
  const selection = useSelection(onClickItem);
  const currentItemIndexRef = useRef<number>();
  currentItemIndexRef.current = items?.findIndex((item) =>
    _.isEqual(item.objectIdInfo, currentItem)
  );

  // Need to ensure the current item is selected (may be driven from route change)
  // Need to ensure the selected item is still in view if items change
  useEffect(() => {
    // TODO find better method than settimeout for scroll to index to work after create item
    let timer: NodeJS.Timeout;
    if (
      currentItemIndexRef.current !== undefined &&
      currentItemIndexRef.current !== -1
    ) {
      const currentSelection = selection.getSelection()[0];

      const currentSelectedIndex = selection.getSelectedIndices()[0];

      if (
        !currentSelection ||
        currentSelectedIndex !== currentItemIndexRef.current
      ) {
        selection.setIndexSelected(currentItemIndexRef.current, true, false);
      }

      // detailsList.current!.scrollToIndex(currentItemIndexRef.current!);
      timer = setTimeout(
        () => detailsList.current!.scrollToIndex(currentItemIndexRef.current!),
        0
      );
    }
    return () => clearTimeout(timer);
  }, [items, selection, detailsList]);

  return selection;
};

// eslint-disable-next-line
const DetailsList = ({
  columns,
  data,
  onClickItem,
  currentItem,
  isLoading,
}: DetailsListProps) => {
  const detailsList = useRef<IDetailsList>(null);
  const [items, setItems] = useState<IAgreementObject[]>([]);
  const selection = useSelectionManager({
    detailsList,
    items,
    currentItem,
    onClickItem,
  });

  useEffect(() => {
    setItems(data);
  }, [data]);

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    headerProps,
    defaultRender
  ) => {
    const newProps: IDetailsHeaderProps = {
      ...headerProps!,
      styles: {
        root: {
          paddingTop: 0,
        },
      },
    };
    return (
      <Sticky
        stickyPosition={StickyPositionType.Header}
        stickyBackgroundColor="transparent"
      >
        {" "}
        <div>{defaultRender!(newProps)}</div>
      </Sticky>
    );
  };
  const getStylesForRow = (detailsRowStyleProps: IDetailsRowStyleProps) => {
    const selectedStyle = `3px solid ${customTheme.focusColor}`;
    return {
      root: {
        borderLeft: detailsRowStyleProps.isSelected
          ? selectedStyle
          : "3px solid transparent",
        borderBottomWidth: "1px",
        borderBottomColor: `${customTheme.divBorderColor}`,
        borderBottomStyle: "solid",
        height: 42,
        lineHeight: 42,
        selectors: {
          ":hover": {
            borderLeft: selectedStyle,
          },
          ":focus": {
            borderLeft: selectedStyle,
          },
        },
      },
      cell: {
        paddingTop: 0,
        paddingBottom: 0,
        selectors: {
          ":first-child": {
            marginLeft: -3,
            fontSize: 14,
          },
        },
      },
    };
  };

  const onRenderRow: IRenderFunction<IDetailsRowProps> = (
    props?: IDetailsRowProps
  ) => <DetailsRow {...props!} styles={getStylesForRow} />;

  return (
    <div
      style={{
        position: "relative",
        height: "Calc(100vh - 170px)",
      }}
    >
      <ScrollablePane
        scrollContainerFocus
        scrollContainerAriaLabel="Scrollable pane with sticky header"
        styles={scrollablePaneStyles}
      >
        <ShimmeredDetailsList
          componentRef={detailsList}
          enableShimmer={isLoading}
          shimmerLines={60}
          items={items}
          compact
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          checkboxVisibility={CheckboxVisibility.hidden}
          selectionPreservedOnEmptyClick
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible
          onRenderDetailsHeader={onRenderDetailsHeader}
          onRenderRow={onRenderRow}
        />
      </ScrollablePane>
    </div>
  );
};

export default DetailsList;
