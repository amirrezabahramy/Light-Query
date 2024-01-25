import { createContext, useContext } from "react";
import { TLightQuery } from "@src/types/globalTypes";
import { TLightQueryProviderProps } from "@src/types/providers/LightQueryProviderTypes";

const LightQueryContext = createContext<TLightQuery>({
  base: {
    baseUrl: "",
    primaryErrorMessage: () => "",
    secondaryErrorMessage: () => "",
  },
  fetch: {
    selectedData: (data) => data,
  },
  mutate: {
    events: {
      success: () => {},
      error: () => {},
      settled: () => {},
    },
  },
});

function LightQueryProvider({ context, children }: TLightQueryProviderProps) {
  return (
    <LightQueryContext.Provider value={context}>
      {children}
    </LightQueryContext.Provider>
  );
}

export function useLightQuery() {
  return useContext(LightQueryContext);
}

export default LightQueryProvider;
