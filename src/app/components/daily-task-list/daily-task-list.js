/**
 * @module DailyTaskList
 */
/**
 * DailyTaskList component
 */
class DailyTaskListCreator {
    constructor () {
        this.template = require('./daily-task-list.hbs');
    }

    /**
   * parse template with given data
   * @param {object} [ data ] - list of tasks
   * @returns {String}
   */
    render (data) {
        return this.template(data);
    }
}

export default new DailyTaskListCreator();

