import { writable } from 'svelte/store'
import { login, register, logout, getSession, isSessionValid } from '$lib/auth'


interface AuthStore {
    email: string
    password: string
    error: string
    isRegistering: boolean
    authenticated: boolean
}


function createAuthStore() {
    const { subscribe, update, set } = writable<AuthStore>({
        email: '',
        password: '',
        error: '',
        isRegistering: false,
        authenticated: false
    })

    const getCurrentStore = () => {
        let current: AuthStore

        subscribe(s => current = s)()

        return current;
    }

    return {
        subscribe,

        checkAuth: async () => {
            const session = await getSession()
            const authStatus = session !== null && await isSessionValid()

            update(store => ({
                ...store,
                authenticated: authStatus,
            }))

            return authStatus
        },

        handleAuth: async () => {
            update(store => ({ ...store, error: '' }))

            try {
                const { email, password, isRegistering } = getCurrentStore()

                if (isRegistering) await register(email, password)

                await login(email, password)

                update(store => ({ ...store, authenticated: true, error: '' }))

                return true
            } catch (err) {
                update(store => ({
                    ...store,
                    authenticated: false,
                    error: err.message || 'Authentication failed'
                }))

                logout()

                return false
            }
        },

        logout: () => {
            logout() 

            set({
                email: '',
                password: '',
                error: '',
                isRegistering: false,
                authenticated: false
            })
        },

        toggleAuthMode: () => {
            update(store => ({
                ...store,
                isRegistering: !store.isRegistering,
                error: ''
            }))
        },

        updateField: (field: keyof AuthStore, value: string | boolean) => {
            update(store => ({ ...store, [field]: value }))
        },
    }
}


export const authStore = createAuthStore()

if (typeof window !== 'undefined') authStore.checkAuth()
