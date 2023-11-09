import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import useBusinessUnit from "hooks/useBusinessUnit";
import { AgreementObjectEditState } from "models/agreements";
import { IClausePanelInfo } from "models/clausePanel";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import {
  IClauseContentInfo,
  IClauseInfo,
  IProvisionedClauseInfo,
} from "models/clauses";
import {
  ICustomClauseContentInfo,
  ICustomClauseInfo,
  IProvisionedCustomClauseInfo,
} from "models/customClauses";
import { clausePanelFormsActions } from "store/clausePanelFormsSlice";
import { customClausePanelFormsActions } from "store/customClausePanelFormsSlice";

const useSharedClausePanelInitializer = (
  isCustomClause: boolean,
  clauseInfoProvider: IProvisionedClauseInfo | IProvisionedCustomClauseInfo,
  panelInfo: IClausePanelInfo | ICustomClausePanelInfo,
  isPanelOpen: boolean
) => {
  const dispatch = useDispatch();

  // "PS Category" clause labels are only used by "Professional Services" business unit
  const { isProfessionalServices } = useBusinessUnit();
  const isBusinessUnitPS = isProfessionalServices();

  const { clauseInfo, clauseContentInfo, setCurrentRevision: defaultSetCurrentRevision } = clauseInfoProvider;
  const clauseInfoRef = useRef<IClauseInfo | ICustomClauseInfo>();
  const clauseContentInfoRef = useRef<IClauseContentInfo | ICustomClauseContentInfo>();

  useEffect(() => {
    if (!isPanelOpen) {
      // Need to reset the current revision of the Panel so its kept in sync with initiator once the panel closes
      // Only needs to target default edit state as revisions are "fake" for the other edit states
      const revision = clauseInfo.revisions?.find((r) => r.id === panelInfo.revisionId);
      if (revision !== undefined && panelInfo.editState === AgreementObjectEditState.Default) {
        defaultSetCurrentRevision(revision);
      }
    }
  }, [isPanelOpen, panelInfo, clauseInfo, defaultSetCurrentRevision, dispatch]);

  useEffect(() => {
    if (!clauseInfo.isLoading && !clauseContentInfo.isLoading) {
      // Need to use deep equals as useEffect() only does shallow comparison
      const isSameClause =
        _.isEqual(clauseInfo, clauseInfoRef.current) &&
        _.isEqual(clauseContentInfo, clauseContentInfoRef.current);

      if (!isSameClause) {
        clauseInfoRef.current = clauseInfo;
        clauseContentInfoRef.current = clauseContentInfo;

        if (isCustomClause) {
          const dispatchClauseInfo = clauseInfo as ICustomClauseInfo;

          dispatch(
            customClausePanelFormsActions.initializeForm({
              clauseInfo: dispatchClauseInfo,
              contentInfo: clauseContentInfo,
              editState: panelInfo.editState,
            })
          );
        } else {
          const dispatchClauseInfo = clauseInfo as IClauseInfo;

          dispatch(
            clausePanelFormsActions.initializeForm({
              clauseInfo: dispatchClauseInfo,
              contentInfo: clauseContentInfo,
              editState: panelInfo.editState,
              isBusinessUnitPS,
            })
          );
        }
      }
    }
  }, [clauseInfo, clauseContentInfo, panelInfo.editState, dispatch]);
};

export default useSharedClausePanelInitializer;
