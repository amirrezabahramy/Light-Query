import { TError, TFetchAPIOptions, TLightQueryBase } from "../globalTypes";

export type TQueryFn<TRequestBody = unknown, TResponseData = unknown> = (
  url: string,
  baseOptions: TLightQueryBase,
  fetchAPIOptions?: TFetchAPIOptions<TRequestBody>
) => Promise<TResponseData | TError>;
