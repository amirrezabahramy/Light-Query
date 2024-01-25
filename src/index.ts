import useFetch from "@src/package/hooks/useFetch";
import useMutate from "@src/package/hooks/useMutate";
import useParallelFetch from "@src/package/hooks/useParallelFetch";
import LightQueryProvider from "@src/package/providers/LightQueryProvider";
import { createLightQueryConfig } from "@src/package/providers/LightQueryProvider";

export {
  createLightQueryConfig,
  LightQueryProvider,
  useFetch,
  useMutate,
  useParallelFetch,
};
