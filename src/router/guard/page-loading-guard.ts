export function createPageLoadingGuard(router: any) {
  router.beforeEach(() => {
    // @ts-ignore
    window.$loadingBar?.start();
  });

  router.afterEach(() => {
    setTimeout(() => {
      // @ts-ignore
      window.$loadingBar?.finish();
    }, 200);
  });

  router.onError(() => {
    // @ts-ignore
    window.$loadingBar?.error();
  });
}
