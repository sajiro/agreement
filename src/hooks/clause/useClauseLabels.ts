import { config } from "config";
import { ILabelData } from "models/clauseLabels";
import {
  useGetClauseLabelsQuery,
  useGetTaggedLabelsQuery,
} from "services/clauseLabel";

type ClauseLabelsInfo = {
  clauseLabels?: ILabelData[];
  isFetchingClauseLabels?: boolean;
};

// "PS Category" clause labels are only used by "Professional Services" business unit
const getClauseLabels = (
  isBusinessUnitPS?: boolean,
  clauseId?: string,
  skip?: boolean,
): ClauseLabelsInfo => {
  const { 
    currentData: clauseLabels,
    isFetching: isFetchingClauseLabels, 
  } = useGetClauseLabelsQuery(clauseId, { 
    skip: !isBusinessUnitPS || !clauseId || skip
  });

  return {
    clauseLabels,
    isFetchingClauseLabels,
  };
};

type UseClauseLabelsInfo = {
  allPsCategoryLabels?: ILabelData[];
  isFetchingPsCategoryLabels?: boolean;
  getClauseLabels: (
    isBusinessUnitPS?: boolean, 
    clauseId?: string,
    skip?: boolean,
  ) => ClauseLabelsInfo;
};

// "PS Category" clause labels are only used by "Professional Services" business unit
const useClauseLabels = (
  isBusinessUnitPS?: boolean,
  skip?: boolean,
): UseClauseLabelsInfo => {
  
  const { 
    currentData: allPsCategoryLabels,
    isFetching: isFetchingPsCategoryLabels 
  } = useGetTaggedLabelsQuery(config.psCategoryTagInfo.id, { 
    skip: !isBusinessUnitPS || skip
  });

  return {
    allPsCategoryLabels,
    isFetchingPsCategoryLabels,
    getClauseLabels,
  };
};

export default useClauseLabels;
