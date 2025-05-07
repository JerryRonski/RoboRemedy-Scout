

const response = await fetch('https://github.com/JerryRonski/RoboRemedy-Scout/blob/main/RoboScout/src/assets/test_config.json');
const configJSON = await response.json();

const versions = Object.keys(configJSON);

export function getConfigList() {
    return versions;
}

export default function getConfig(name: string) {
    return configJSON[name];
}