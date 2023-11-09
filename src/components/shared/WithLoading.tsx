import { ComponentType } from "react";

export enum LoaderType {
  Spinner,
  Shimmer,
}

type WithLoadingProps = {
  isLoading: boolean;
  LoadingSubstitute: () => JSX.Element;
  [key: string]: any;
};

// eslint-disable-next-line
const WithLoading =
  (Component: ComponentType<any>) =>
  // eslint-disable-next-line
  ({ isLoading, LoadingSubstitute, ...componentProps }: WithLoadingProps) =>
    (
      <>
        {isLoading && <LoadingSubstitute />}
        {!isLoading && <Component {...componentProps} />}
      </>
    );

export default WithLoading;
