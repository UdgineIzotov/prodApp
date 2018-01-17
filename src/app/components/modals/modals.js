/**
 * @module Modals
 */

export default {
    /**
     * render add item modal
     * @member renderAddItem
     * @type {Functuon}
     */
    renderAddItem () {
        return (require('./templates/add-item-modal.hbs'))();
    },
    /**
     * render edit item model with given item
     * @member renderEditItem
     * @type {Functuon}
     * @param {object} data
     */
    renderEditItem (data) {
        return (require('./templates/edit-item-modal.hbs'))(data);
    },

    /**
     * render confirming deleting modal
     * @member renderDeleteItem
     * @type {Functuon}
     */
    renderDeleteItem () {
        return (require('./templates/delete-item-modal.hbs'))();
    }
};
