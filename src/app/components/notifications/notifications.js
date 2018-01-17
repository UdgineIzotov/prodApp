import { PubSub } from '../../Pubsub';
/**
 * @module Notifications
 */
/**
 * to use - run PubSum.publish('render/Notification', options)
 */
class NotificationsComponent{

    renderArea = document.querySelector('.notifications')

    template = require('./notifications.hbs')
    /**
     * render notification with given options
     * @param {object} options 
     */
    render (options) {
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.innerHTML = Notifications.template(options);

        fragment.appendChild(div);
        Notifications.initNotification(fragment);

        Notifications.renderArea.appendChild(fragment);
    }

    /**
     * init notification actions
     * @param {DomNode} node 
     */
    initNotification (node) {
        const closeBtn = node.querySelector('.notify .hide-btn');

        closeBtn.addEventListener('click', Notifications.removeNotification);

        setTimeout(Notifications.removeNotification, 1000);
    }
    /**
     * hides the notification
     */
    removeNotification () {
        const closeBtn = Notifications.renderArea.querySelector('.notifications .hide-btn');
        closeBtn.removeEventListener('click', Notifications.removeNotification);

        Notifications.renderArea.removeChild(Notifications.renderArea.firstChild);
    }
};

export const Notification = new NotificationsComponent();
PubSub.subscribe('render/Notification', Notifications.render);
