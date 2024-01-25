import useFetch from "@src/package/hooks/useFetch";
import useMutate from "@src/package/hooks/useMutate";
import useParallelFetch from "@src/package/hooks/useParallelFetch";
import LightQueryProvider from "@src/package/providers/LightQueryProvider";
import { TLightQuery } from "@src/types/globalTypes";

export {
  TLightQuery,
  useFetch,
  useMutate,
  useParallelFetch,
  LightQueryProvider,
};
