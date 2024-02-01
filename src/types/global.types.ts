export type TQueryType = "fetch" | "mutate";

export type TStatus = "idle" | "loading" | "success" | "error";
export type TError = Error;

export type TFetchAPIOptions<RequestData> = Omit<
  RequestInit,
  "method" | "body"
> & {
  body?: RequestData;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

// Light query config
export type TLightQueryBase = {
  baseUrl?: string;
  timeout?: number;
  primaryErrorMessage?: (response: Response) => string;
  secondaryErrorMessage?: (error: TError) => string;
};

export type TLightQueryFetch<
  TResponseData = unknown,
  TSelectedData = TResponseData
> = {
  selectedData?: (data: TResponseData) => TSelectedData;
};

export type TLightQueryMutate<TResponseData = unknown> = {
  events?: {
    success?: (data: TResponseData) => void;
    error?: (error: TError) => void;
    settled?: () => void;
  };
};

export type TLightQueryConfig<
  TFetchResponseData = unknown,
  TFetchSelectedData = unknown,
  TMutateResponseData = unknown
> = {
  base?: TLightQueryBase;
  fetch?: TLightQueryFetch<TFetchResponseData, TFetchSelectedData>;
  mutate?: TLightQueryMutate<TMutateResponseData>;
};

export type TBaseQueryProps<TRequestBody> = {
  name: string;
  url: string;
  fetchAPIOptions?: TFetchAPIOptions<TRequestBody>;
};

export type TBaseQueryReturnObject<TData> = {
  status: TStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: TData | null;
  error: TError | null;
};
