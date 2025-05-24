import { account, ID } from '$lib/appwrite'
import type { Models } from 'appwrite'

let loggedInUser: Models.User<Models.Preferences> | null = null

export async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password)
    loggedInUser = await account.get()
}

export async function register(email: string, password: string) {
    await account.create(ID.unique(), email, password)
    login(email, password)
}

export async function logout() {
    await account.deleteSession('current')
    loggedInUser = null
}

export async function getUser() {
    return loggedInUser
}