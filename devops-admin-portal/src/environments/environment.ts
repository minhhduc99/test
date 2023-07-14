// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version: '0.10.2',
  production: false,
  base_url: 'http://localhost:3000',
  //base_url: 'http://107.113.192.156:3000',
  keycloak: {
    realm: "sysops-svmc-services",
    //auth_server_url: "https://107.113.53.220:18443/auth/",
    auth_server_url: "http://107.113.53.220:18094/auth/",
    resource: "fem"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
