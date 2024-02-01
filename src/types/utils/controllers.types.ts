import { TError, TFetchAPIOptions, TLightQueryBase } from "../global.types";

export type TQueryFn<TRequestBody = unknown, TResponseData = unknown> = (
  url: string,
  baseOptions: TLightQueryBase,
  fetchAPIOptions?: TFetchAPIOptions<TRequestBody>
) => Promise<TResponseData | TError>;
