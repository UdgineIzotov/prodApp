import { SettingsModel } from './settings.model';

describe('settings model tests', () => {
    const defaultSettings = {
        workTime: 15,
        workIteration: 4,
        shortBreak: 4,
        longBreak: 25
    };

    it('should set default settings on setSettings', () => {
        spyOn(sessionStorage, 'setItem');

        SettingsModel.setSettings();

        expect(sessionStorage.setItem).toHaveBeenCalledWith('settings', JSON.stringify(defaultSettings));
    });

    it('should set user settings on setSettings', () => {
        spyOn(sessionStorage, 'setItem');

        const userSettings = defaultSettings;
        userSettings.workIteration = 5;
        userSettings.workTime = 25;


        SettingsModel.setSettings(userSettings);

        expect(sessionStorage.setItem).toHaveBeenCalledWith('settings', JSON.stringify(userSettings));
    });
});
