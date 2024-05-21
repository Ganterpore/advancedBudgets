import { Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public'

export const createClient = async () => {
  const auth0Client = await createAuth0Client({
    domain: PUBLIC_AUTH0_DOMAIN,
    clientId: PUBLIC_AUTH0_CLIENT_ID,
  })
  return auth0Client
};

export const login = async (auth0Client: Auth0Client) => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: PUBLIC_BASE_URL + 'login',
      audience: 'budget-backend'
    }
  })
}

export const logout = async (auth0Client: Auth0Client) => {
  await auth0Client.logout({
    logoutParams: {
      returnTo: PUBLIC_BASE_URL + 'login'
    }
  })
}