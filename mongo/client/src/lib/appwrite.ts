import { Client, Account, Databases } from 'appwrite'

export const client = new Client()

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('680cb14c000544158e0c')

export const account = new Account(client)
export { ID, Query } from 'appwrite'
export const dbs = new Databases(client)
export async function getCurrentUser() {
    try {
        return await account.get();
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
