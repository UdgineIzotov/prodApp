import { SettingsPubsub } from './observer';
/**
 * @namespace SettingsUI
 */

export default function SettingsUI (options) {
    const elem = options.elem;
    const step = options.step;

    const maxValue = options.maxValue;
    const minValue = options.minValue;

    const observer = SettingsPubsub;

    const valueField = elem.querySelector('.settings-input-field');

    elem.onclick = function (event) {
        if (event.target.closest('.settings-input-minus')) {
            fieldDecrease();
        } else if (event.target.closest('.settings-input-plus')) {
            fieldIncrease();
        }
    };
    /**
     * decreases the value
     * @memberOf SettingsUI
     */
    function fieldDecrease () {
        if (+valueField.innerHTML - step < minValue) return;
        valueField.innerHTML = parseInt(valueField.innerHTML, 10) - step;
        observer.notify({
            name: elem.classList[0],
            op: '-',
            step: options.step
        });
    }
    /**
     * increases the value
     * @memberOf SettingsUI
     */
    function fieldIncrease () {
        if (+valueField.innerHTML + step > maxValue) return;
        valueField.innerHTML = parseInt(valueField.innerHTML, 10) + step;
        observer.notify({
            name: elem.classList[0],
            op: '+',
            step: options.step
        });
    }
}

