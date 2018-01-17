/**
 * @module JQueryPlugins
 */
/**
 * plugin tabs. Sets switcher to all "a" tags
 * @memberof module:JQueryPlugins
 * @type {JQueryFunction}
 * @name tabs
 */
$.fn.tabs = function (selectedClass) {
    selectedClass = selectedClass || 'selected';

    const links = this.find('a');

    links.on('click', (e) => {
        e.preventDefault();
        links.removeClass(selectedClass);
        $(e.target).addClass(selectedClass);
    });


    return this;
};
