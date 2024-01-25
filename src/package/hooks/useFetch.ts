import { useEffect, useState } from "react";
import {
  TUseFetchProps,
  TUseFetchReturnObject,
} from "@src/types/hooks/useFetchTypes";
import { TError, TLightQueryConfig, TStatus } from "@src/types/globalTypes";
import { useLightQuery } from "@src/package/providers/LightQueryProvider";
import { queryFn } from "@src/package/utils/controllers";

function useFetch<
  TResponseData = unknown,
  TSelectedData = TResponseData,
  TRequestBody = null
>(
  props: TUseFetchProps<TRequestBody, TResponseData>
): TUseFetchReturnObject<TResponseData, TSelectedData> {
  // Overriding default config
  const lightQuery: TLightQueryConfig = useLightQuery();
  const overriddenBaseOptions = { ...lightQuery.base, ...props.base };
  const overriddenFetchOptions = { ...lightQuery.fetch, ...props.fetch };

  // States
  const [status, setStatus] = useState<TStatus>("idle");
  const [responseData, setResponseData] = useState<TResponseData | null>(null);
  const [data, setData] = useState<TSelectedData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  // Main effect
  useEffect(() => {
    // Controller
    const controller = new AbortController();

    // Fetching data
    const fetchData = async () => {
      try {
        setStatus("loading");
        // Query
        const data = await queryFn(props.url, overriddenBaseOptions, {
          signal: controller.signal,
          ...props.fetchAPIOptions,
        }).then((responseData) => {
          setResponseData(responseData as TResponseData);
          return overriddenFetchOptions.selectedData(
            responseData as TResponseData
          ) as TSelectedData;
        });
        // Query
        setData(data);
        setStatus("success");
      } catch (error) {
        setError(error as TError);
        setStatus("error");
      }
    };
    (props.isActive === undefined || props.isActive === true) && fetchData();

    return () => {
      controller.abort();
    };
  }, [...(props.dependencies || []), props.isActive]);

  // Result
  return {
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    responseData,
    data,
    error,
  };
}

export default useFetch;
