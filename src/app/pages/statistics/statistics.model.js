import { tasks } from '../../test/fakerMaker';
/**
 * @module StatisticsPage
 */

/** statistics model class */
class StatisticsModel {
    constructor () {
        // if (statisticsModel) {
        //     return statisticsModel;
        // }

        this.tasks = tasks;
        return this;
    }

    /**
     * calls get method depending on options
     * @param {object} options
     */
    getGroupedData (options) {
        switch (options.time) {
            case 'Day':
                return (options.type === 'Tasks') ? this.getDailyTasks() : this.getDailyPomodoros();
            case 'Week':
                return (options.type === 'Tasks') ? this.getWeeklyTasks() : this.getWeeklyPomodoros();
            case 'Month':
                return (options.type === 'Tasks') ? this.getMonthlyTasks() : this.getMonthlyPomodoros();
            default:
                return undefined;
        }
    }

    /**
     * gets sorted daily tasks data
     * @returns {object} - sorted tasks by urgency
     */
    getDailyTasks () {
        const tasks = {
            low: 0, middle: 0, hight: 0, urgent: 0, failed: 0
        };

        this.tasks.forEach((task) => {
            if (task.estimationFailed < task.estimationSucced) {
                tasks[task.priority]++;
            } else {
                tasks.failed++;
            }
        });

        return tasks;
    }

    /**
     * gets sorted daily pomodoros data
     * @returns {object} - sorted pomodoros by urgency
     */
    getDailyPomodoros () {
        const pomodoros = {
            low: 0, middle: 0, hight: 0, urgent: 0, failed: 0
        };

        this.tasks.forEach((task) => {
            pomodoros[task.priority] += task.estimationSucced;
            pomodoros.failed += task.estimationFailed;
        });

        return pomodoros;
    }

    /**
     * gets sorted weekly pomdoros data
     * @returns {object} - sorted pomodoros by urgency
     */
    getWeeklyPomodoros () {
        const pomodoros = {
            low: new Array(7).fill(0),
            middle: new Array(7).fill(0),
            hight: new Array(7).fill(0),
            urgent: new Array(7).fill(0),
            failed: new Array(7).fill(0)
        };

        this.tasks.forEach((task) => {
            let id = task.deadline.getDay();
            id = (id === 0) ? 6 : id - 1;

            pomodoros[task.priority][id] += task.estimationSucced;
            pomodoros.failed[id] += task.estimationFailed;
        });

        return pomodoros;
    }

    /**
     * gets sorted weekly tasks data
     * @returns {object} - sorted tasks by urgency
     */
    getWeeklyTasks () {
        const tasks = {
            low: new Array(7).fill(0),
            middle: new Array(7).fill(0),
            hight: new Array(7).fill(0),
            urgent: new Array(7).fill(0),
            failed: new Array(7).fill(0)
        };

        this.tasks.forEach((task) => {
            let id = task.deadline.getDay();
            id = (id === 0) ? 6 : id - 1;

            if (task.estimationFailed < task.estimationSucced) {
                tasks[task.priority][id]++;
            } else {
                tasks.failed[id]++;
            }
        });

        return tasks;
    }

    /**
     * gets sorted monthly pomodoros data
     * @returns {object} - sorted pomodoros by urgency
     */
    getMonthlyPomodoros () {
        const tasks = {
            low: new Array(31).fill(0),
            middle: new Array(31).fill(0),
            hight: new Array(31).fill(0),
            urgent: new Array(31).fill(0),
            failed: new Array(31).fill(0)
        };

        this.tasks.forEach((task) => {
            const id = task.deadline.getDate();

            if (task.estimationFailed < task.estimationSucced) {
                tasks[task.priority][id]++;
            } else {
                tasks.failed[id]++;
            }
        });

        return tasks;
    }

    /**
     * gets sorted monthly tasks data
     * @returns {object} - sorted tasks by urgency
     */
    getMonthlyTasks () {
        const tasks = {
            low: new Array(31).fill(0),
            middle: new Array(31).fill(0),
            hight: new Array(31).fill(0),
            urgent: new Array(31).fill(0),
            failed: new Array(31).fill(0)
        };

        this.tasks.forEach((task) => {
            const id = task.deadline.getDate();

            if (task.estimationFailed < task.estimationSucced) {
                tasks[task.priority][id]++;
            } else {
                tasks.failed[id]++;
            }
        });

        return tasks;
    }
}


export const statisticsModel = new StatisticsModel();
