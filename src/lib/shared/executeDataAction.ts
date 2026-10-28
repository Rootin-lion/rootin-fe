import { actionFailure } from "./actionFailure";
import { apiError } from "./apiError";

type ActionFailure = {
  code: string;
  message: string;
};

export async function executeNestedDataAction<
  R extends { data: { data: unknown } },
>(request: () => Promise<R>, failure: ActionFailure) {
  try {
    const data: R["data"]["data"] = (await request()).data.data;
    if (!data) return actionFailure(failure);
    return { ok: true, data } as const;
  } catch (error) {
    return actionFailure(apiError(error, failure.message));
  }
}

export async function executeResponseDataAction<R extends { data: unknown }>(
  request: () => Promise<R>,
  failure: ActionFailure,
) {
  try {
    const data: R["data"] = (await request()).data;
    if (!data) return actionFailure(failure);
    return { ok: true, data } as const;
  } catch (error) {
    return actionFailure(apiError(error, failure.message));
  }
}
