const baseTitle = import.meta.env.VITE_TITLE

export function createPageTitleGuard(router: any) {
  router.afterEach((to: any) => {
    const pageTitle = to.meta?.title
    console.log("pageTitle---------: ", pageTitle)
    if (pageTitle) {
      document.title = `${pageTitle} | ${baseTitle}`
    } else {
      document.title = baseTitle
    }
  })
}
