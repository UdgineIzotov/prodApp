import Graph from '../../components/settings/graph';
import SettingsUI from '../../components/settings/settings';
import { SettingsPubsub } from '../../components/settings/observer';


import { PubSub } from '../../Pubsub';

/**
 * @memberof module:SettingsPage
 */
class SettingsView {
    /**
     * initing navigation actions
     */
    initNav () {
        const self = this;
        $('.pages-nav').tabs();
        const settings = document.querySelector('#pomodoros');
        const categories = document.querySelector('#categories');

        const saveBtn = document.querySelector('.save');

        saveBtn.addEventListener('click', () => {
            PubSub.publish('settingsModel/saveSettings', SettingsView.graph.getSettings());
        });

        settings.addEventListener('click', (event) => {
            event.preventDefault();

            self.renderSettings();
        });

        categories.addEventListener('click', (event) => {
            event.preventDefault();

            self.renderCategories();
        });
    }

    /**
     * renders page
     */
    render () {
        PubSub.publish('render/header', { settings: 'selected' });


        const main = document.querySelector('main');
        main.innerHTML = (require('./settings.hbs'))();
        main.className = 'settings';


        this.initNav();
        this.initComponents();

        $('body').tooltip();
    }

    /**
     * initing page components
     */
    initComponents () {
        SettingsView.workTime = new SettingsUI({
            elem: document.getElementsByClassName('work-time')[0],
            step: 5,
            minValue: 15,
            maxValue: 25
        });
        SettingsView.workIteration = new SettingsUI({
            elem: document.getElementsByClassName('work-iteration')[0],
            step: 1,
            minValue: 2,
            maxValue: 5

        });
        SettingsView.shortBreak = new SettingsUI({
            elem: document.getElementsByClassName('short-break')[0],
            step: 1,
            minValue: 3,
            maxValue: 5

        });
        SettingsView.longBreak = new SettingsUI({
            elem: document.getElementsByClassName('long-break')[0],
            step: 5,
            minValue: 15,
            maxValue: 30
        });

        const graphField = document.getElementsByClassName('graph-bar')[0];
        SettingsView.graph = new Graph(graphField);
        SettingsView.graph.renderGraph();

        SettingsPubsub.addObserver(SettingsView.graph.renderGraph);
    }

    /** renders settings tab */
    renderSettings () {
        const main = document.querySelector('main');
        main.innerHTML = (require('./settings.hbs'))();
        this.initComponents();
        this.initNav();

        $(main).tooltip();
    }
    /** renders categories tab */
    renderCategories () {
        const content = document.querySelector('.page-content');
        const innerHtml = require('./settings-categories.hbs');
        content.innerHTML = innerHtml();

        $(content).tooltip();
    }
}

export default new SettingsView();

