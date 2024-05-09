import { getUserById, getUserByUsername, newUser } from '../login/userModel'

export const getAuthToken = async (username: string): Promise<string> => {
  const user = await getUserByUsername(username)
  if (user) return user.id.toString()
  return (await newUser({ username: username })).toString()
}

export const getUserDetailsFromToken = async (authToken: string) => {
  return getUserById(Number(authToken))
}