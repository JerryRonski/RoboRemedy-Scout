import { DynamicEntry } from "./MatchEntry";

let configJSON: Record<string, DynamicEntry>;

export function loadConfig(): Promise<void> {
  return fetch("https://raw.githubusercontent.com/JerryRonski/RoboRemedy-Scout/main/RoboScout/src/assets/config.json")
    .then(res => res.json())
    .then(data => {
      configJSON = data;
      console.log("Config loaded:", data);
    });
}

export function getConfigList(): string[] {
  return Object.keys(configJSON);
}

export default function getConfig(version: string) {
  return configJSON[version];
}
