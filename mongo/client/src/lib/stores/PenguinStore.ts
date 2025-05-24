
import { writable } from 'svelte/store'
import { getCurrentUser, account, client, dbs, ID, Query } from '$lib/appwrite'

const DB_ID = '680cb160000f31feac5e'
const CL_ID = '680cb18a000e3943f9c3'
const RP_ID = '681862ef002c2f99cdb8'

interface Penguin {
    $id: string
    name: string
    description?: string
    type: string
    rarity: string
}

interface Report {
    type: string
    penguin_id?: string
    user_id: string
    success: boolean
}

interface PenguinStore {
    penguins: Penguin[]
    selectedPenguin: Penguin | null
    loading: boolean
    error: string | null
}

interface loadParams {
    type?: string
    startsWith?: string
    rarity?: string
}

function createPenguinStore() {
    const { subscribe, update, set } = writable<PenguinStore>({
        penguins: [],
        selectedPenguin: null,
        loading: true,
        error: null,
    })

    const loadPenguins = async (params: loadParams = {}) => {
        update(store => ({ ...store, loading: true, error: null }))

        const user = await getCurrentUser()

        console.log(user)
        
        try {
            const queries = [Query.orderDesc('$createdAt'), Query.limit(100)]

            if (params.type && params.type !== "All") queries.push(Query.equal('type', params.type))
            if (params.rarity && params.rarity !== "Any") queries.push(Query.equal("rarity", params.rarity))

            if (params.startsWith) queries.push(Query.startsWith("name", params.startsWith))

            const res = await dbs.listDocuments(DB_ID, CL_ID, queries)

            update(store => ({
                ...store,
                penguins: res.documents as Penguin[],
                loading: false
            }))
        } catch (err) {
            update(store => ({
                ...store,
                error: err.message,
                loading: false
            }))
        }
    }

    const createPenguin = async (name: string, description: string = '', type: string = 'Penguin', rarity: string = 'Common'): Promise<boolean> => {
        if (!name.trim()) {
            update(store => ({ ...store, error: 'Name is required' }))
            return false
        }

        update(store => ({ ...store, loading: true, error: null }))

        // const user = getCurrentUser().$id

        try {
            const newPenguin = await dbs.createDocument(
                DB_ID,
                CL_ID,
                ID.unique(),
                {
                    name: name.trim(),
                    description: description,
                    type: type,
                    rarity: rarity,
                }
            )

            update(store => ({
                ...store,
                penguins: [newPenguin, ...store.penguins],
                loading: false,
            }))

            return true
        } catch (err) {
            update(store => ({
                ...store,
                error: err.message,
                loading: false
            }))
            return false
        }  
    }

    const updatePenguin = async (name: string, description: string) => {
        update(store => {
            if (!store.selectedPenguin) return store
            
            return { ...store, loading: true, error: null }
        })

        try {
            const currentStore = getCurrentStore()
            
            if (!currentStore.selectedPenguin) return

            const updatedPenguin = await dbs.updateDocument(
                DB_ID,
                CL_ID,
                currentStore.selectedPenguin.$id,
                {
                    name: name,
                    description: description
                }
            )

            update(store => ({
                ...store,
                penguins: store.penguins.map(p => 
                    p.$id === updatedPenguin.$id ? updatedPenguin : p
                ),
                loading: false,
                editMode: false,
                selectedPenguin: null
            }))
            return true;
        } catch (err) {
            update(store => ({
                ...store,
                error: err.message,
                loading: false
            }))
        }
    }

    const deletePenguin = async () => {
        update(store => {
            if (!store.selectedPenguin) return store
            
            return { ...store, loading: true, error: null }
        })

        try {
            const currentStore = getCurrentStore()
            if (!currentStore.selectedPenguin) return
 
            await dbs.deleteDocument(
                DB_ID,
                CL_ID,
                currentStore.selectedPenguin.$id
            )

            update(store => ({
                ...store,
                penguins: store.penguins.filter(p => p.$id !== currentStore.selectedPenguin.$id),
                loading: false,
                selectedPenguin: null
            }))
        } catch (err) {
            update(store => ({
                ...store,
                error: err.message,
                loading: false
            }))
        }
    }

    const showContextMenu = (e: MouseEvent, penguin: Penguin) => {
        e.preventDefault()

        update(store => ({
            ...store,
            selectedPenguin: penguin
        }))
    }

    const closeMenu = () => {
        update(store => ({
            ...store,
            selectedPenguin: null
        }))
    }

    const validateInput = (name: string): boolean => {
        if (!name.trim()) {
            update(store => ({ 
                ...store, 
                error: 'Name is required',
                loading: false
            }))
            return false
        }
        return true
    }

    const getCurrentStore = () => {
        let current: PenguinStore
        subscribe(s => current = s)()
        return current!
    }

    loadPenguins()

    return {
        subscribe,
        loadPenguins,
        updatePenguin,
        createPenguin,
        deletePenguin,
        showContextMenu,
        closeMenu,
        validateInput
    }
}

export const penguinStore = createPenguinStore()
export const  types = [
    { value: 'Penguin', label: 'Penguin' },
    { value: 'Kitty', label: 'Kitty' },
    { value: 'Other', label: 'Other' }
]
export const  raritys = [
    { value: 'Epic', label: 'Epic', color: '#F02070' },
    { value: 'Rare', label: 'Rare', color: '#F0A020' },
    { value: 'Common', label: 'Common', color: '#3498db' }
]
export const getCountByType = async () => {
    const { documents } = await dbs.listDocuments(DB_ID, CL_ID)
    const grouped = documents.reduce((acc, doc) => {
        if (!acc[doc.type]) acc[doc.type] = []

        acc[doc.type].push(doc)
        
        return acc
    }, {})

    return grouped
}
export const getReport = async (query: string) => {
    const queries = [Query.orderDesc('$createdAt')]

    if (query !== "") queries.push(Query.startsWith('name', query))

    const { documents } = await dbs.listDocuments(DB_ID, CL_ID, queries)
    const grouped = documents.reduce((acc, doc) => {
        if (!acc[doc.type]) acc[doc.type] = []

        acc[doc.type].push(doc)
        
        return acc
    }, {})

    return grouped
}

  
