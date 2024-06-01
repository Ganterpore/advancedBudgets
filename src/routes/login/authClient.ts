import { Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID } from '$env/static/public'

export const createClient = async () => {
  const auth0Client = await createAuth0Client({
    domain: PUBLIC_AUTH0_DOMAIN,
    clientId: PUBLIC_AUTH0_CLIENT_ID,
    useRefreshTokens: true,
    cacheLocation: 'localstorage'
  })
  return auth0Client
};

export const login = async (auth0Client: Auth0Client, baseUrl: string) => {
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`
  }
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: baseUrl + '/login',
      audience: 'budget-backend',
      scope: 'openid profile email offline_access'
    }
  })
}

export const logout = async (auth0Client: Auth0Client, baseUrl: string) => {
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`
  }
  await auth0Client.logout({
    logoutParams: {
      returnTo: baseUrl + '/login'
    }
  })
}