export const Handlebars = require('handlebars/runtime');

/**
 * @namespace HandlebarsHelpers
 */

/**
  * return Day of the Date
  * @memberOf HandlebarsHelpers
  * @name getDay
  */
Handlebars.registerHelper('getDay', function (data) {
    const date = new Date(data.fn(this));

    return date.getDate();
});
/**
  * return Month of the Date
  * @memberOf HandlebarsHelpers
  * @name getMonth
  */
Handlebars.registerHelper('getMonth', function (data) {
    const date = new Date(data.fn(this));

    const month = date.toLocaleString('en-us', { month: 'short' });

    return month;
});
/**
  * compares categories
  * @memberOf HandlebarsHelpers
  * @name isCategory
  */
Handlebars.registerHelper('isCategory', (inputCategory, category) => {
    if (inputCategory === category) {
        return 'checked';
    }

    return undefined;
});
/**
  * compares priorities
  * @memberOf HandlebarsHelpers
  * @name isPriority
  */
Handlebars.registerHelper('isPriority', (inputPriority, priority) => {
    if (inputPriority === priority) {
        return 'checked';
    }

    return undefined;
});
/**
  * formats Date to proper value
  * @memberOf HandlebarsHelpers
  * @name dataFormat
  */
Handlebars.registerHelper('dataFormat', (date) => {
    const parsedDate = (new Date(date)).toISOString().split('T');

    return parsedDate[0];
});
/**
  * display succed pomodoros
  * @memberOf HandlebarsHelpers
  * @name forEstimationCount
  */
Handlebars.registerHelper('forEstimationCount', (chbEstimation, estimation) => {
    if (chbEstimation <= estimation) {
        return 'checked';
    }

    return undefined;
});

/**
  * returns nowDate
  * @memberOf HandlebarsHelpers
  * @name nowDate
  */
Handlebars.registerHelper('nowDate', () => {
    const now = (new Date()).toISOString().split('T');

    return now[0];
});

