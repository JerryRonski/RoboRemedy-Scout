import { DataService } from "../services/DataService";


export interface DynamicEntry {
    matchId: number;
    teamNumber: number;
    [key: string]: string | number | boolean;
}

export async function createMatchEntry(): Promise<DynamicEntry> {
    const dataService = new DataService();
    await dataService.ready();
    const fields = await dataService.get('currVers');

    const MatchEntry: DynamicEntry = {
        matchId: 0,
        teamNumber: 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(fields).forEach(([fieldName, fieldConfig]: any) => {
        if (fieldConfig.type === 'text' || fieldConfig.type === 'radio') {
            MatchEntry[fieldName] = '';
        } else if (fieldConfig.type === 'number' || fieldConfig.type === 'range') {
            MatchEntry[fieldName] = 0;
        } else if (fieldConfig.type === 'checkbox') {
            MatchEntry[fieldName] = false;
        }
    });

    return MatchEntry;

}