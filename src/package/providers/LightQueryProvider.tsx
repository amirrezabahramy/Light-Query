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
      settle: () => {},
    },
  },
});

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
