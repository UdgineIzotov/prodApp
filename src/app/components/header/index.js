// example of exporting header component
// export * from './header';

import { PubSub } from '../../Pubsub';

let isDeleteItemsON = false;
/**
 * @module HeaderComponent
 */
/** Class for rendering and operationg header */
class HeaderViewCreator {
    constructor () {
        this.template = require('./header.hbs');
    }

    get deleteItemsON () {
        return isDeleteItemsON;
    }

    set deleteItemsON (val) {
        isDeleteItemsON = val;
    }
    /**
     * renders header with given options
     * @param {object} options
     */
    render (options) {
        const headerNode = document.querySelector('header');
        const headerHtml = HeaderView.template(options);

        headerNode.innerHTML = headerHtml;

        if (options && options.addItemsDisplay && options.deleteItemsDisplay) {
            this.initTaskPageControls();
        }
    }
    /**
     * initing delete button in header
     */
    initTaskPageControls () {
        const deleteBtn = document.querySelector('#delete-items');
        const deleteCountNode = document.querySelector('.delete-count');
        const addItemBtn = document.querySelector('#add-items');

        addItemBtn.addEventListener('click', (e) => {
            e.preventDefault();
            PubSub.publish('header/add-btn-click');
        });

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (this.deleteItemsON) {
                deleteCountNode.style.display = 'none';
            }
            if (!this.deleteItemsON) {
                deleteCountNode.style.display = 'block';
            }

            this.deleteItemsON = !this.deleteItemsON;
            PubSub.publish('delete-items-pressed', this.deleteItemsON);
        });
    }

    /**
     * renders given number of tasks to delete
     * @param {number} count
     */
    displayDeletedCount (count) {
        const deleteCountNode = document.querySelector('.delete-count');

        deleteCountNode.innerText = count;
    }
}

export const HeaderView = new HeaderViewCreator();

PubSub.subscribe('tasks-to-delete-changed', HeaderView.displayDeletedCount);
PubSub.subscribe('render/header', HeaderView.render.bind(HeaderView));

