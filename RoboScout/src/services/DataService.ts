import { Storage } from "@ionic/storage";
import { DynamicEntry } from "../assets/MatchEntry";

export class DataService {
    private storage: Storage | null = null;

    async init() {
        const storage = new Storage();
        this.storage = await storage.create();
    }

    async ready() {
        if (!this.storage) await this.init(); // await dataService.ready()
    }

    async set(key: string, value: unknown) {
        await this.storage?.set(key, value);
    }

    async get(key: string) {
        return await this.storage?.get(key);
    }

    async isEntry(id: number, team: number) {
        const entries = await this.storage?.get('entries') || [];
        const index = entries.findIndex((m: DynamicEntry) => m.matchId === id && m.teamNumber === team);

        if (index < 0) {
            return false;
        } else {
            return true;
        }
    }

    async getEntry(id: number, team: number) {
        const entries = await this.storage?.get('entries') || [];
        const index = entries.findIndex((m: DynamicEntry) => m.matchId === id && m.teamNumber === team);
        return entries[index];
    }

    async addEntry(entry: DynamicEntry) {
        let result = '';
        
        const entries = await this.storage?.get('entries') || [];
        const index = entries.findIndex((m: DynamicEntry) => m.matchId === entry.matchId && m.teamNumber === entry.teamNumber);

        if (index === -1) {
            entries.push(entry);
            result = 'add';
        } else {
            entries[index] = entry;
            result = 'update';
        }

        await this.storage?.set('entries', entries);

        return result;
    }

    async remove(key:string) {
        await this.storage?.remove(key);
    }
}