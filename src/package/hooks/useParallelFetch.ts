import { useEffect, useState } from "react";
import {
  TUseParallelFetchReturnObject,
  TUseParallelFetchResultObject,
  TUseParallelFetchProps,
} from "@src/types/hooks/useParallelFetchTypes";
import { TLightQuery } from "@src/types/globalTypes";
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
  const lightQuery: TLightQuery = useLightQuery();
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

  // Main effect
  useEffect(() => {
    // Controller
    const controller = new AbortController();

    // Fetching data
    const fetchData = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        props.queries.map((query, index) =>
          queryFn(query.url, overriddenBaseOptions[index], {
            signal: controller.signal,
            ...query.fetchAPIOptions,
          })
        )
      );
      const mappedResults = results.map((result, index) => {
        const isSuccess = result.status === "fulfilled";
        return isSuccess
          ? {
              isSuccess: true,
              isError: false,
              responseData: result.value,
              data: overriddenFetchOptions[index].selectedData(
                result.value as TResponseData
              ),
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

    return () => {
      controller.abort();
    };
  }, [...(props.dependencies || []), props.isActive]);

  return { isLoading, results };
}

export default useParallelFetch;
