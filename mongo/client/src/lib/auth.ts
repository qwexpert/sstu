import { account, ID } from '$lib/appwrite'
import type { Models } from 'appwrite'

let currentSession: Models.Session | null = null

export async function login(email: string, password: string) {
    currentSession = await account.createEmailPasswordSession(email, password)
}

export async function register(email: string, password: string) {
    await account.create(ID.unique(), email, password)
    login(email, password)
}

export async function logout() {
    await account.deleteSession('current')
    currentSession = null
}


export async function getSession() {
    if (!currentSession) {
        try {
            currentSession = await account.getSession('current')
        } catch (error) {
            currentSession = null
        }
    }

    return currentSession
}

export async function isSessionValid() {
    try {
        const session = await getSession()

        if (!session) return false

        return true
    } catch (error) {
        return false
    }
}

export async function updateSession() {
    if (await isSessionValid()) {
        currentSession = await account.getSession('current')
        return currentSession
    }

    return null
}