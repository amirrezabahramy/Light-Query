import { useCallback, useEffect, useState } from "react";
import { TError, TLightQuery, TStatus } from "../../types/globalTypes";
import {
  TMutate,
  TUseMutateProps,
  TUseMutateReturnObject,
} from "../../types/hooks/useMutateTypes";
import { useLightQuery } from "../providers/LightQueryProvider";
import { joinUrls } from "@src/package/utils/helpers";
import { queryFn } from "@src/package/utils/controllers";

function useMutate<TRequestBody = unknown, TResponseData = unknown>(
  props: TUseMutateProps<TRequestBody, TResponseData>
): TUseMutateReturnObject<TRequestBody, TResponseData> {
  // Overriding default config
  const lightQuery: TLightQuery = useLightQuery();
  const overriddenBaseOptions = { ...lightQuery.base, ...props.base };
  const overriddenMutateOptions = { ...lightQuery.mutate, ...props.mutate };

  // States
  const [status, setStatus] = useState<TStatus>("idle");
  const [data, setData] = useState<TResponseData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  // Mutate function
  const mutate: TMutate<TRequestBody> = useCallback(async (body) => {
    try {
      setStatus("loading");
      const data = (await queryFn(
        joinUrls(overriddenBaseOptions.baseUrl, props.url),
        overriddenBaseOptions,
        {
          ...props.fetchAPIOptions,
          body:
            JSON.stringify(body) || JSON.stringify(props.fetchAPIOptions?.body),
        }
      )) as TResponseData;

      setData(data);
      setStatus("success");

      // success event
      overriddenMutateOptions.events?.success &&
        overriddenMutateOptions.events.success(data);
    } catch (error) {
      setError(error as TError);
      setStatus("error");

      // Error event
      overriddenMutateOptions.events?.error &&
        overriddenMutateOptions.events.error(error as TError);
    } finally {
      // Finish event
      overriddenMutateOptions.events?.settle &&
        overriddenMutateOptions.events.settle();
    }
  }, []);

  // Result
  return {
    mutate,
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    data,
    error,
  };
}

export default useMutate;
