import { actionFailure } from "./actionFailure";
import { apiError } from "./apiError";

type ActionFailure = {
  code: string;
  message: string;
};

async function executeDataAction<R, D>(
  request: () => Promise<R>,
  selectData: (response: R) => D,
  failure: ActionFailure,
) {
  try {
    const data = selectData(await request());
    if (!data) return actionFailure(failure);
    return { ok: true, data } as const;
  } catch (error) {
    return actionFailure(apiError(error, failure.message));
  }
}

export async function executeNestedDataAction<
  R extends { data: { data: unknown } },
>(request: () => Promise<R>, failure: ActionFailure) {
  return executeDataAction<R, R["data"]["data"]>(
    request,
    (response) => response.data.data,
    failure,
  );
}

export async function executeResponseDataAction<R extends { data: unknown }>(
  request: () => Promise<R>,
  failure: ActionFailure,
) {
  return executeDataAction<R, R["data"]>(
    request,
    (response) => response.data,
    failure,
  );
}
