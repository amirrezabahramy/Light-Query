import { TError } from "@src/types/globalTypes";
import { TQueryFn } from "@src/types/utils/controllersTypes";
import { joinUrls } from "./helpers";

export const queryFn: TQueryFn = async (url, baseOptions, fetchAPIOptions) =>
  new Promise((resolve, reject) =>
    fetch(joinUrls(baseOptions.baseUrl, url), {
      ...fetchAPIOptions,
      body: fetchAPIOptions?.body && JSON.stringify(fetchAPIOptions?.body),
    } as RequestInit)
      .then((response) => {
        if (!response.ok)
          reject(
            new Error(
              baseOptions.primaryErrorMessage &&
                baseOptions.primaryErrorMessage(response)
            )
          );
        resolve(response.json());
      })
      .catch((error) => {
        reject(
          new Error(
            baseOptions.secondaryErrorMessage &&
              baseOptions.secondaryErrorMessage(error as TError)
          )
        );
      })
  );
