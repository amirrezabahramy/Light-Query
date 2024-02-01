import { TError } from "@src/types/global.types";
import { TQueryFn } from "@src/types/utils/controllers.types";
import { joinUrls } from "./helpers";

export const queryFn: TQueryFn = async (url, baseOptions, fetchAPIOptions) =>
  new Promise((resolve, reject) =>
    fetch(baseOptions?.baseUrl ? joinUrls(baseOptions.baseUrl, url) : url, {
      ...fetchAPIOptions,
      body: fetchAPIOptions?.body && JSON.stringify(fetchAPIOptions?.body),
    } as RequestInit)
      .then((response) => {
        if (!response.ok)
          reject(
            new Error(
              baseOptions?.primaryErrorMessage &&
                baseOptions.primaryErrorMessage(response)
            )
          );
        resolve(response.json());
      })
      .catch((error) => {
        if (error instanceof DOMException) {
          reject(
            new Error(`Timeout of ${baseOptions?.timeout}ms has been exceeded.`)
          );
        }
        reject(
          new Error(
            baseOptions?.secondaryErrorMessage &&
              baseOptions.secondaryErrorMessage(error as TError)
          )
        );
      })
  );
