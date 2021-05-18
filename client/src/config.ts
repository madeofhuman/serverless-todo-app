// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'u4053c7ige'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'madeofhuman.us.auth0.com',            // Auth0 domain
  clientId: 'wIdc7cA3X14RnwtwaRZuTiKGFAWaH1gd',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
