/**
 * @module GlobalTaskList
 */

/**
 *  GlobalTaskList - responsible for rendering global tasks lists
 */
class GlobalTaskList {
    constructor () {
        this.template = require('./global-task-list.hbs');
    }

    /**
   * parse template with given data
   * @param {object} data - list of tasks
   * @returns {String}
   */
    render (data) {
        return this.template(data);
    }
}

export default new GlobalTaskList();

