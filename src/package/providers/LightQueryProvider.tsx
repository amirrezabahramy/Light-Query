import { createContext, useContext } from "react";
import { TLightQueryConfig } from "@src/types/globalTypes";
import { TLightQueryProviderProps } from "@src/types/providers/LightQueryProviderTypes";

const LightQueryContext = createContext<TLightQueryConfig>(
  {} as TLightQueryConfig
);

export function createLightQueryConfig<
  TFetchResponseData = unknown,
  TFetchSelectedData = unknown,
  TMutateResponseData = unknown
>(
  config: TLightQueryConfig<
    TFetchResponseData,
    TFetchSelectedData,
    TMutateResponseData
  >
) {
  return config;
}

function LightQueryProvider({ config, children }: TLightQueryProviderProps) {
  return (
    <LightQueryContext.Provider value={config}>
      {children}
    </LightQueryContext.Provider>
  );
}

export function useLightQuery() {
  return useContext(LightQueryContext);
}

export default LightQueryProvider;
