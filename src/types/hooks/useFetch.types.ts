import {
  TBaseQueryProps,
  TBaseQueryReturnObject,
  TLightQueryBase,
  TLightQueryFetch,
} from "../global.types";

export type TUseFetchProps<TRequestBody, TResponseData> = {
  dependencies?: React.DependencyList;
  isActive?: boolean;
} & TBaseQueryProps<TRequestBody> & {
    base?: Partial<TLightQueryBase>;
    fetch?: Partial<TLightQueryFetch<TResponseData>>;
  };

export type TUseFetchReturnObject<TResponseData, TSelectedData> =
  TBaseQueryReturnObject<TSelectedData> & {
    responseData: TResponseData | null;
  };
