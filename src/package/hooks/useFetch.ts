import { useEffect, useRef, useState } from "react";
import {
  TUseFetchProps,
  TUseFetchReturnObject,
} from "@src/types/hooks/useFetch.types";
import { TError, TLightQueryConfig, TStatus } from "@src/types/global.types";
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

  // Controller
  const controllerRef = useRef<AbortController>(new AbortController());

  // Main effect
  useEffect(() => {
    // Fetching data
    const fetchData = async () => {
      overriddenBaseOptions.timeout &&
        setTimeout(() => {
          controllerRef.current.abort();
        }, overriddenBaseOptions.timeout);
      try {
        setStatus("loading");
        // Query
        const data = await queryFn(props.url, overriddenBaseOptions, {
          signal: controllerRef.current.signal,
          ...props.fetchAPIOptions,
        }).then((responseData) => {
          setResponseData(responseData as TResponseData);
          return overriddenFetchOptions.selectedData
            ? (overriddenFetchOptions.selectedData(
                responseData as TResponseData
              ) as TSelectedData)
            : (responseData as TSelectedData);
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
