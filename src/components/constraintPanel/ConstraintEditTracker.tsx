import { IConstraintEditTracker } from "models/constraintMutation";
import { createContext, ReactNode, useContext } from "react";

const ConstraintEditErrorContext = createContext<IConstraintEditTracker>({
  failedEdits: {},
  isSubmitting: false,
  setFailedConstraintCreation: () => {},
  setFailedValueCreations: () => {},
  setFailedValueDeletions: () => {},
  toggleIsSubmitting: () => {},
  clear: () => {}
});

export const useConstraintEditErrorTracker = () => useContext(ConstraintEditErrorContext);

function ConstraintEditTracker({ children, errorTracker: constraintEditor }: { children?: ReactNode; errorTracker: IConstraintEditTracker; }) {
  return (
    <ConstraintEditErrorContext.Provider value={constraintEditor}>
      {children}
    </ConstraintEditErrorContext.Provider>
  );
}

export default ConstraintEditTracker;