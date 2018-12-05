// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  HTTP_URL_APIFULL: "https://sit1apifull.tracfone.com/oauth/ro",
  HTTP_URL_ADMIN: "http://localhost:8080/cop/rest/main/",
  HTTP_URL_REPORT: "http://localhost:8080/cop/rest/reports/", 
  HTTP_URL_ACTION: "http://localhost:8080/cop/rest/action/",
  HTTP_URL_TOOLS: "http://localhost:8080/cop/rest/tool/",
  HTTP_URL_NOTIFICATION: "http://localhost:8080/cop/rest/notification/"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
