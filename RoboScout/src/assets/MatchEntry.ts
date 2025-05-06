import test_config from '../assets/test_config.json'

const fields = test_config.test;

export interface DynamicEntry {
    matchId: number;
    teamNumber: number;
    [key: string]: string | number | boolean;
}

const MatchEntry: DynamicEntry = {
    matchId: 0,
    teamNumber: 0,
};

Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.type === 'text' || fieldConfig.type === 'radio') {
        MatchEntry[fieldName] = '';
    } else if (fieldConfig.type === 'number' || fieldConfig.type === 'range') {
        MatchEntry[fieldName] = 0;
    } else if (fieldConfig.type === 'checkbox') {
        MatchEntry[fieldName] = false;
    }
});

export default MatchEntry;