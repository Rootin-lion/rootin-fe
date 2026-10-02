export function actionFailure(error: { code: string; message: string }) {
  return {
    ok: false,
    error,
  } as const;
}
