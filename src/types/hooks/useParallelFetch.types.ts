import { TUseFetchProps, TUseFetchReturnObject } from "./useFetch.types";

export type TUseParallelFetchProps<TRequestBody, TResponseData> = {
  queries: Array<
    Omit<
      TUseFetchProps<TRequestBody, TResponseData>,
      "isActive" | "dependencies"
    >
  >;
  isActive?: boolean;
  dependencies?: React.DependencyList;
};

export type TUseParallelFetchResultObject<TResponseData, TSelectedData> = Omit<
  TUseFetchReturnObject<TResponseData, TSelectedData>,
  "isLoading"
>;

export type TUseParallelFetchReturnObject<TResponseData, TSelectedData> = {
  isLoading: boolean;
  results:
    | Array<TUseParallelFetchResultObject<TResponseData, TSelectedData>>
    | [];
};
