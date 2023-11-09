import {
  IAgreementObject,
  IAgreementObjectId,
  UseGetAllQueryType,
} from "models/agreements";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { RouteComponent, routeDefinitions } from "router";
import _ from "lodash";
import useRouter from "./useRouter";

type UseFilteredItemsReturnType = [
  IAgreementObject[],
  boolean,
  (event?: ChangeEvent<HTMLInputElement>, newValue?: string) => void
];
type FilteredItemsState = {
  filteredItems: IAgreementObject[];
  isLoading: boolean;
};

const useFilteredItems = (
  useGetAllQuery: UseGetAllQueryType
): UseFilteredItemsReturnType => {
  const { data: items, isLoading, isError } = useGetAllQuery();
  const [filteredItems, setFilteredItems] = useState<FilteredItemsState>({
    filteredItems: [],
    isLoading: true,
  });
  const filterRef = useRef<string>();

  const applyFilterOnItems = useCallback(
    (isLoadingAgr: boolean, itemsAgr: IAgreementObject[] | undefined) => {
      const filter = filterRef.current;

      // const matchesFilter = (item: IAgreementObject) => filter ? item.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0 : true;
      const matchesFilter = (item: IAgreementObject) => {
        const filterKeys = Object.keys(item);
        
        if (filter) {
          return filterKeys.some((key) => {
            if (
              key === "name" || 
              key === "key" ||
              key === "constraintName"
            ) {
              return (
                (item[`${key}`] as string)
                  .toLowerCase()
                  .indexOf(filter.toLowerCase()) > -1
              );
            }
            return undefined;
          });
        }
        return true;
      };

      const filterResult = itemsAgr?.filter(matchesFilter) || [];
      setFilteredItems({
        isLoading: isLoadingAgr,
        filteredItems: filterResult,
      });
    },
    [setFilteredItems]
  );

  useEffect(() => {
    if (!isLoading && !isError) {
      const itemsCopy = items ? _.cloneDeep<IAgreementObject[]>(items!) : [];
      applyFilterOnItems(false, itemsCopy);
    }
  }, [items, isLoading, applyFilterOnItems, isError]);

  const onFilterChangedHandler = (
    event?: ChangeEvent<HTMLInputElement>,
    filter?: string
  ) => {
    filterRef.current = filter;
    applyFilterOnItems(filteredItems.isLoading, items);
  };

  return [
    filteredItems.filteredItems,
    filteredItems.isLoading,
    onFilterChangedHandler,
  ];
};

const useFetchItems = (
  useGetAllQuery: UseGetAllQueryType,
  type: RouteComponent
) => {
  const [currentItem, SetCurrentItem] = useState<
    IAgreementObjectId | undefined
  >(undefined);
  const { updateRoute, getRouteInfo } = useRouter();
  const [filteredItems, isLoading, onFilterChangedHandler] =
    useFilteredItems(useGetAllQuery);

  const setCurrentItem = useCallback(
    (objectIdInfo: IAgreementObjectId) => {
      updateRoute(routeDefinitions[type].getRouteInfo(objectIdInfo));
      SetCurrentItem(objectIdInfo);
    },
    [SetCurrentItem, updateRoute, type]
  );

  useEffect(() => {
    const objectIdInfo = getRouteInfo()?.objectIdInfo;
    const isObjectIdUnDefined = _.isEmpty(objectIdInfo);
    if (
      !isLoading &&
      (isObjectIdUnDefined || !_.isEqual(currentItem, objectIdInfo))
    ) {
      let newCurrentItem = isObjectIdUnDefined ? filteredItems[0]?.objectIdInfo : objectIdInfo;
      newCurrentItem = newCurrentItem || { isNothingSelected: true };
      setCurrentItem(newCurrentItem!);
    }
  });

  return {
    items: filteredItems,
    onFilterChangedHandler,
    currentItem,
    setCurrentItem,
    isLoading,
  };
};

export default useFetchItems;
