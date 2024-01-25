import { useCallback, useState } from "react";
import { TError, TLightQueryConfig, TStatus } from "../../types/globalTypes";
import {
  TMutate,
  TMutateAsync,
  TUseMutateProps,
  TUseMutateReturnObject,
} from "../../types/hooks/useMutateTypes";
import { useLightQuery } from "../providers/LightQueryProvider";
import { queryFn } from "@src/package/utils/controllers";

function useMutate<TRequestBody = unknown, TResponseData = unknown>(
  props: TUseMutateProps<TRequestBody, TResponseData>
): TUseMutateReturnObject<TRequestBody, TResponseData> {
  // Overriding default config
  const lightQuery: TLightQueryConfig = useLightQuery();
  const overriddenBaseOptions = { ...lightQuery.base, ...props.base };
  const overriddenMutateOptions = { ...lightQuery.mutate, ...props.mutate };

  // States
  const [status, setStatus] = useState<TStatus>("idle");
  const [data, setData] = useState<TResponseData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  // Mutate function
  const mutate: TMutate<TRequestBody> = useCallback(
    async (body) => {
      try {
        setStatus("loading");
        const data = (await queryFn(props.url, overriddenBaseOptions, {
          ...props.fetchAPIOptions,
          body,
          method: props.fetchAPIOptions?.method || "POST",
        })) as TResponseData;

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
        overriddenMutateOptions.events?.settled &&
          overriddenMutateOptions.events.settled();
      }
    },
    [props.fetchAPIOptions?.body]
  );

  // Mutate function (Promise version)
  const mutateAsync: TMutateAsync<TRequestBody, TResponseData> = useCallback(
    (body) =>
      new Promise(async (resolve, reject) => {
        try {
          setStatus("loading");
          const data = (await queryFn(props.url, overriddenBaseOptions, {
            ...props.fetchAPIOptions,
            body,
            method: props.fetchAPIOptions?.method || "POST",
          })) as TResponseData;

          setData(data);
          setStatus("success");
          resolve(data);
        } catch (error) {
          setError(error as TError);
          setStatus("error");
          reject(error);
        }
      }),
    [props.fetchAPIOptions?.body]
  );

  // Result
  return {
    mutate,
    mutateAsync,
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    data,
    error,
  };
}

export default useMutate;
