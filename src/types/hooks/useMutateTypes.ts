import {
  TBaseQueryProps,
  TBaseQueryReturnObject,
  TLightQueryBase,
  TLightQueryMutate,
} from "../globalTypes";

export type TUseMutateProps<TRequestBody, TResponseData> =
  TBaseQueryProps<TRequestBody> & {
    base?: Partial<TLightQueryBase>;
    mutate?: Partial<TLightQueryMutate<TResponseData>>;
  };

export type TMutate<TRequestBody> = (body?: TRequestBody) => void;
export type TMutateAsync<TRequestBody, TResponseData> = (
  body?: TRequestBody
) => Promise<TResponseData>;

export type TUseMutateReturnObject<TRequestBody, TResponseData> =
  TBaseQueryReturnObject<TResponseData> & {
    mutate: TMutate<TRequestBody>;
    mutateAsync: TMutateAsync<TRequestBody, TResponseData>;
  };
