import { useEffect, useRef, useState } from "react";
import {
  TUseParallelFetchReturnObject,
  TUseParallelFetchResultObject,
  TUseParallelFetchProps,
} from "@src/types/hooks/useParallelFetch.types";
import { TLightQueryConfig } from "@src/types/global.types";
import { useLightQuery } from "@src/package/providers/LightQueryProvider";
import { queryFn } from "../utils/controllers";

function useParallelFetch<
  TResponseData = unknown,
  TSelectedData = TResponseData,
  TRequestBody = unknown
>(
  props: TUseParallelFetchProps<TRequestBody, TResponseData>
): TUseParallelFetchReturnObject<TResponseData, TSelectedData> {
  // Overriding default config
  const lightQuery: TLightQueryConfig = useLightQuery();
  const overriddenBaseOptions = props.queries.map((query) => ({
    ...lightQuery.base,
    ...query.base,
  }));
  const overriddenFetchOptions = props.queries.map((query) => ({
    ...lightQuery.fetch,
    ...query.fetch,
  }));

  // States
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState<
    Array<TUseParallelFetchResultObject<TResponseData, TSelectedData>>
  >([]);

  // Controller
  const controllerRef = useRef<AbortController>(new AbortController());

  // Main effect
  useEffect(() => {
    // Fetching data
    const fetchData = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        props.queries.map((query, index) => {
          overriddenBaseOptions[index].timeout &&
            setTimeout(() => {
              controllerRef.current.abort();
            }, overriddenBaseOptions[index].timeout);
          return queryFn(query.url, overriddenBaseOptions[index], {
            signal: controllerRef.current.signal,
            ...query.fetchAPIOptions,
          });
        })
      );
      const mappedResults = results.map((result, index) => {
        const isSuccess = result.status === "fulfilled";
        return isSuccess
          ? {
              isSuccess: true,
              isError: false,
              responseData: result.value,
              data: overriddenFetchOptions[index].selectedData
                ? overriddenFetchOptions[index].selectedData!(
                    result.value as TResponseData
                  )
                : (result.value as TSelectedData),
              error: null,
            }
          : ({
              isSuccess: false,
              isError: true,
              responseData: null,
              data: null,
              error: result.reason,
            } as TUseParallelFetchResultObject<TResponseData, TSelectedData>);
      });
      setResults(
        mappedResults as Array<
          TUseParallelFetchResultObject<TResponseData, TSelectedData>
        >
      );
      setLoading(false);
    };

    (props.isActive === undefined || props.isActive === true) && fetchData();
  }, [...(props.dependencies || []), props.isActive]);

  return { isLoading, results };
}

export default useParallelFetch;
