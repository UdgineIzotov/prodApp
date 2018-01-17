import { PubSub } from '../../Pubsub';
/**
 * @module SettingsPage
 */
/**
 * settings model class
 */
class SettingsModelCreator {
    constructor () {
        this.workTime = 15;
        this.workIteration = 4;
        this.shortBreak = 4;
        this.longBreak = 25;
    }

    /**
   * set settings to local storage
   * @param settings
   */
    setSettings (settings) {
        if (settings) {
            SettingsModel.workTime = settings.workTime;
            SettingsModel.workIteration = settings.workIteration;
            SettingsModel.shortBreak = settings.shortBreak;
            SettingsModel.longBreak = settings.longBreak;
        }

        const jsonSettings = JSON.stringify({
            workTime: SettingsModel.workTime,
            workIteration: SettingsModel.workIteration,
            shortBreak: SettingsModel.shortBreak,
            longBreak: SettingsModel.longBreak
        });

        sessionStorage.setItem('settings', jsonSettings);
    }
}

export const SettingsModel = new SettingsModelCreator();

PubSub.subscribe('settingsModel/setDefaultSettings', SettingsModel.setSettings);
PubSub.subscribe('settingsModel/saveSettings', SettingsModel.setSettings);

