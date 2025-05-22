import { DynamicEntry } from "../assets/MatchEntry";

export class ConfigService {
    private configJSON: Record<string, DynamicEntry> = {};

    async ready() {
        await fetch('/config.json')
            .then(res => res.json())
            .then(data => {
                this.configJSON = data;
                console.log('Config Loaded: ', data);
            });
    }

    getAll() {
        return this.configJSON;
    }

    getList() {
        return Object.keys(this.configJSON);
    }

    get(version: string) {
        return this.configJSON[version];
    }
}
