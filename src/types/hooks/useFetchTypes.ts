import {
  TBaseQueryProps,
  TBaseQueryReturnObject,
  TLightQueryBase,
  TLightQueryFetch,
} from "../globalTypes";

export type TUseFetchProps<TRequestBody, TResponseData> = {
  isActive?: unknown;
} & TBaseQueryProps<TRequestBody> & {
    base?: Partial<TLightQueryBase>;
    fetch?: Partial<TLightQueryFetch<TResponseData>>;
  };

export type TUseFetchReturnObject<TResponseData, TSelectedData> =
  TBaseQueryReturnObject<TSelectedData> & {
    responseData: TResponseData | null;
  };
