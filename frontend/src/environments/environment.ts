// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  testData: true, // Change this value to turn the test data on or off. Test data means that no connection to the server will be established
  baseURL: '', // for not production case we are using the Angular proxy. Which is automatically started by calling ng serve.
};
