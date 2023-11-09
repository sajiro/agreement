import {
  CommandBarButton,
  ConstrainMode,
  DetailsList,
  DetailsRow,
  IColumn,
  IDetailsHeaderProps,
  IDetailsRowProps,
  IRenderFunction,
  IScrollablePaneStyles,
  mergeStyles,
  ProgressIndicator,
  ScrollablePane,
  SelectionMode,
  Sticky,
  StickyPositionType,
} from "@fluentui/react";

import customTheme from "helpers/customTheme";
import React, { useCallback, useEffect, useState } from "react";
import { useGetSlotTranslationsQuery } from "services/slot";
import stringsConst from "consts/strings";
import icons from "components/shared/Icons";
import useTemplateEditPanelManager from "hooks/template/useTemplateEditPanelManager";
import { ITemplateRevisionSlot, ITemplateRevisionSlotItem } from "models/slot";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import _ from "lodash";

import { getFlatlist, isSlotGroup, setCollapsed } from "helpers/slot";
import Groups from "./groups";
import Default from "./groups/default";
import TemplateEditEmptyContentDisplay from "../TemplateEditEmptyContentDisplay";

const scrollablePaneStyles: Partial<IScrollablePaneStyles> = {
  root: {
    overflowX: "hidden",
  },
  contentContainer: {
    overflowX: "hidden",
  },
};

const containerClass = mergeStyles({
  ...customTheme.templateEditTabsContainer,
});

const ButtonClass = mergeStyles({
  background: "transparent",
  height: "100%",
  padding: "0 10px",
});

const ButtonListClass = mergeStyles({
  backgroundColor: customTheme.actionsBackgroundColor,
  height: 45,
  borderBottom: `1px solid ${customTheme.divBorderColor}`,
});

const ListingClass = mergeStyles({
  height: "calc(100vh - 225px)",
  backgroundColor: customTheme.white,
  overflow: "auto",
  position: "relative",
  zIndex: 0,
});

const HeaderClass = mergeStyles({
  fontWeight: 600,
  display: "flex",
  fontSize: 14,
  backgroundColor: customTheme.white,
  color: `${customTheme.bodyColor}`,
  height: 43,
  alignItems: "center",
  borderBottom: `1px solid ${customTheme.divBorderColor}`,
  ".title": {
    width: 362,
    paddingLeft: 12,
  },
});

type PreviewPanelProps = {
  templateId: string;
  revisionId: string;
};

const getStylesForRow = () => ({
  root: {
    color: customTheme.bodyColor,
    borderColor: customTheme.bodyDividerSemanticColor,
  },
  cell: {
    padding: 0,
    selectors: {
      ":first-child": {},
    },
  },
});

function TemplateTranslation({ ...templateInfo }: PreviewPanelProps) {
  const {
    currentData: slotsData,
    isLoading: slotsLoading,
    isFetching,
  } = useGetSlotTranslationsQuery(templateInfo);

  const [selectedItem, setSelectedItem] = useState<ITemplateRevisionSlot>();

  const { openClausePanel } = useTemplateEditPanelManager();
  const [slotItems, setSlotItems] = useState<ITemplateRevisionSlotItem[]>([]);

  useEffect(() => {
    if (!slotsLoading && slotsData) {
      const filteredSlots = getFlatlist(slotsData, "full");
      setSlotItems(filteredSlots);
    }
  }, [slotsLoading, slotsData]);

  const listingColumns: IColumn[] = React.useMemo(
    () => [
      {
        key: "partName",
        name: stringsConst.common.clause,
        fieldName: "partName",
        minWidth: 200,
        maxWidth: 300,
      },
    ],
    []
  );

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = () => (
    <>
      {slotsData && (
        <Sticky
          stickyPosition={StickyPositionType.Header}
          stickyBackgroundColor="transparent"
        >
          <div className={HeaderClass}>
            <div className="title">{stringsConst.common.clause}</div>
            <div>{stringsConst.common.translations}</div>
          </div>
        </Sticky>
      )}
      {null}
    </>
  );

  const onRenderRow: IRenderFunction<IDetailsRowProps> = (
    props?: IDetailsRowProps
  ) => <DetailsRow {...props!} styles={getStylesForRow} />;

  const setChildBg = (obj: ITemplateRevisionSlotItem, value: boolean) => {
    const slotObj = { ...obj };
    slotObj.slots.forEach((element: any) => {
      // eslint-disable-next-line no-param-reassign
      element.isParentSelected = value;
      if (element.slots.length > 0) {
        setChildBg(element, value);
      }
    });

    return slotObj;
  };

  const itemChanged = useCallback(
    (item?: ITemplateRevisionSlotItem | undefined) => {
      const tmpSlotItemsReset = _.cloneDeep(slotItems);

      tmpSlotItemsReset.forEach((element: ITemplateRevisionSlotItem) => {
        const tmpEl = element;
        tmpEl.isParentSelected = false;
        tmpEl.current = false;
      });

      setSlotItems(tmpSlotItemsReset);
      const tmpSlotItems = _.cloneDeep(tmpSlotItemsReset);

      tmpSlotItems.forEach((element: ITemplateRevisionSlotItem) => {
        if (item?.id === element.id) {
          const tmpEl = element;
          tmpEl.isParentSelected = true;
          tmpEl.current = true;
          setChildBg(tmpEl, true);
        }
      });

      const filteredSlots = getFlatlist([item!]);
      const result = tmpSlotItems.map((obj: ITemplateRevisionSlotItem) => {
        const isSelected = filteredSlots.includes(obj.id);
        return {
          ...obj,
          isParentSelected: !!isSelected,
        };
      });
      setSlotItems(result);
      if (item?.partId !== stringsConst.common.previewZeros) {
        setSelectedItem(item);
      } else {
        setSelectedItem(undefined);
      }
    },
    [slotItems]
  );

  const insertInto = (
    arr: ITemplateRevisionSlot[],
    index: number,
    ...newItems: ITemplateRevisionSlot[]
  ) => [...arr.slice(0, index), ...newItems, ...arr.slice(index)];

  const collapseCallback = useCallback(
    (
      id: string,
      item: ITemplateRevisionSlot[],
      slot: ITemplateRevisionSlotItem
    ) => {
      const slotIdx = slotItems.findIndex((itemi) => itemi.id === id);

      if (slot.isCollapsed) {
        const tmpSlotItems = _.cloneDeep(slotItems);
        const tmpItem = _.cloneDeep(item);
        tmpSlotItems[slotIdx].isCollapsed = false;

        const filteredSlots = getFlatlist(tmpItem);
        const result = tmpSlotItems.filter(
          (_item: ITemplateRevisionSlotItem) =>
            filteredSlots.indexOf(_item.id) === -1
        );
        setSlotItems(result);
      } else {
        const tmpSlotItems = _.cloneDeep(slotItems);
        const tmpItem = _.cloneDeep(item);
        setCollapsed(tmpItem, false);
        tmpSlotItems[slotIdx].isCollapsed = true;

        const tmpSub = [...tmpItem];
        const result = insertInto(tmpSlotItems, slotIdx + 1, ...tmpSub);
        setSlotItems(result as ITemplateRevisionSlotItem[]);
      }
    },
    [slotsData, slotItems]
  );

  const onRenderColumn = (item?: any) => {
    if ((item.slots && item.slots.length > 0) || isSlotGroup(item)) {
      return <Groups item={item} collapseSlots={collapseCallback} />;
    }
    return <Default item={item} />;
  };

  const isEmptyTemplate = !slotsData && !slotsLoading && !isFetching;
  return (
    <div className={containerClass}>
      <div className={ButtonListClass}>
        <CommandBarButton
          className={ButtonClass}
          iconProps={icons.openFile}
          text={stringsConst.templateEdit.translation.OpenClause}
          disabled={!selectedItem}
          onClick={() => {
            openClausePanel(selectedItem?.partId as TemplateEditPanelType);
          }}
        />
        <ProgressIndicator
          ariaValueText="Progress bar"
          styles={{
            itemProgress: {
              padding: 0,
              visibility: slotsLoading || isFetching ? undefined : "hidden",
            },
          }}
        />
      </div>
      <div className={ListingClass}>
        {isEmptyTemplate && (
          <TemplateEditEmptyContentDisplay
            message={
              stringsConst.templateEdit.messages.EmptyTemplateGenericMessage
            }
          />
        )}
        <ScrollablePane
          scrollContainerFocus
          scrollContainerAriaLabel="Sticky component example"
          styles={scrollablePaneStyles}
        >
          <DetailsList
            onRenderItemColumn={onRenderColumn}
            onActiveItemChanged={itemChanged}
            setKey="set"
            selectionPreservedOnEmptyClick
            checkboxVisibility={2}
            onRenderRow={onRenderRow}
            onRenderDetailsHeader={onRenderDetailsHeader}
            constrainMode={ConstrainMode.unconstrained}
            items={slotItems}
            columns={listingColumns}
            selectionMode={SelectionMode.single}
            isHeaderVisible
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />
        </ScrollablePane>
      </div>
    </div>
  );
}

export default React.memo(TemplateTranslation);
