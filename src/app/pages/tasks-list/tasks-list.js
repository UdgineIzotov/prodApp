// require('./tasks-list.less');
import { PubSub } from '../../Pubsub';

import { Router } from '../../router';

import { HeaderView } from '../../components/header/index';
import DailyTaskList from '../../components/daily-task-list/daily-task-list';
import GlobalTaskList from '../../components/global-task-list/global-task-list';
import Modals from '../../components/modals/modals';

let thisTask; // for current task for modals
let tasksToDelete = []; // for containing task for deleting

const modalContainer = document.querySelector('.modals');
const main = document.querySelector('main');

let mainFragment;

require('webpack-jquery-ui/datepicker');


/**
 * task list view
 * @memberof module:TaskListPage
 */
class TaskListView {
    constructor () {
        /**
       * remders edit task modal
       * @param {object} - task to edit
       */
        this.renderEditTaskModal = renderEditTaskModal;

        /**
       * remders add task modal
       */
        this.renderAddTask = renderAddTaskModal;

        /** handles deleting items */
        this.deleteItemsHandle = deleteItemsHandle;
    }

    /** renders page */
    render () {
        PubSub.publish('render/header', {
            deleteItemsDisplay: true,
            addItemsDisplay: true,
            globalList: 'selected'
        });
        $('header').tooltip();

        this.renderMainContent();
    }

    /** renders page main content  */
    renderMainContent () {
        if (isNewUser()) {
            const fragment = document.createDocumentFragment();
            const div = document.createElement('div');
            div.innerHTML = (require('./templates/first-entrance.hbs'))();

            fragment.appendChild(div);

            const skipBtn = fragment.querySelector('.skip');
            skipBtn.addEventListener('click', () => {
                PubSub.publish('settingsModel/setDefaultSettings');
            });

            main.innerHTML = '';
            main.appendChild(fragment);
            $('main').tooltip();

            return;
        }

        PubSub.publish('model/requestTasksData');
    }
    /**
     * renders Task lists
     * @param {object} options
     */
    renderTaskLists (options) {
        if (options === 0) {
            renderNoTasks();

            return;
        }

        mainFragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.innerHTML = (require('./templates/global-list.hbs'))();
        mainFragment.appendChild(div);

        /** ******************** */
        /** * Init Functional ** */
        /** ******************** */

        const functionalArea = mainFragment.querySelector('.main-content');
        const addItemsCaptionBtn = mainFragment.querySelector('.add-items-caption');

        addItemsCaptionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderAddTaskModal();
        });

        functionalArea.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;

            if (target.className === 'category-strip' && HeaderView.deleteItemsON) {
                const taskNode = e.target.parentNode;
                selectTaskToDelete(taskNode);
            }
            if (target.closest('.up')) {
                const upNode = target.closest('.up');
                const id = upNode.dataset.id;
                PubSub.publish('model/taskToDaily', id);
            }
            if (target.closest('.edit')) {
                const editNode = target.closest('.edit');

                const id = editNode.dataset.id;
                PubSub.publish('model/getTaskByIdForEditing', id);
            }
            if (target.closest('.timer')) {
                const timerNode = target.closest('.timer');
                Router.navigate(`timer/${timerNode.dataset.id}`);
            }
        });

        initUrgencyFilter(mainFragment);
        initDoneNav(mainFragment);

        main.innerHTML = '';
        main.appendChild(mainFragment);

        $(main).tooltip();


        PubSub.publish('model/getDailyTasks');
        PubSub.publish('model/getGlobalTasks');
    }

    /**
     * renders daily task list
     * @param {array} tasks
     */
    renderDailyList (tasks) {
        if (tasks.length === 0) {
            // DOTO
        }

        const dailyContainer = document.querySelector('.daily-tasks');
        dailyContainer.innerHTML = DailyTaskList.render({ tasks });
        $(dailyContainer).tooltip();
    }

    /**
     * renders global task lists
     * @param {array} tasks
     */
    renderGlobalList (tasks) {
        let globalInnerHtml = '';
        tasks.forEach((list) => {
            globalInnerHtml += GlobalTaskList.render(list);
        });

        const listNode = document.querySelector('#global-lists');
        listNode.innerHTML = globalInnerHtml;
        $(listNode).tooltip();
    }
}

export default new TaskListView();

function renderNoTasks () {
    main.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const container = document.createElement('div');
    container.innerHTML = (require('./templates/add-first-task.hbs'))();
    fragment.appendChild(container);

    const addCaptionBtn = fragment.querySelector('#add-items');

    addCaptionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderAddTaskModal();
    });

    const addImage = fragment.querySelector('.add-first-task .pomadoro-img');
    addImage.addEventListener('click', (e) => {
        e.preventDefault();
        renderAddTaskModal();
    });

    main.appendChild(fragment);
}

function isNewUser () {
    const isNewUser = sessionStorage.getItem('isNewUser');

    if (isNewUser !== 'false') {
        sessionStorage.setItem('isNewUser', 'false');

        return true;
    }

    return false;
}


let canselBtn;
let trashBtn;
let confirmBtn;
function renderEditTaskModal (task) {
    modalContainer.style.display = 'block';
    thisTask = task;


    modalContainer.innerHTML = Modals.renderEditItem(task);

    $('.edit-task-form #deadline').datepicker({
        showOtherMonths: true,
        dateFormat: 'yy-mm-dd'
    });

    canselBtn = document.querySelector('.edit-task-form .actions .cansel');
    trashBtn = document.querySelector('.edit-task-form .actions .trash');
    confirmBtn = document.querySelector('.edit-task-form .actions .confirm');

    canselBtn.addEventListener('click', hideModal);
    trashBtn.addEventListener('click', trashBtnClick);
    confirmBtn.addEventListener('click', editTaskClick);
}

function trashBtnClick () {
    tasksToDelete = [thisTask.id.toString()];
    hideModal();
    renderRUSureModal();
}

function hideModal () {
    if (canselBtn) {
        canselBtn.removeEventListener('click', hideModal);
        canselBtn = null;
    }
    if (trashBtn) {
        trashBtn.removeEventListener('click', trashBtnClick);
        trashBtn = null;
    }
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', editTaskClick);
        confirmBtn.removeEventListener('click', addTaskClick);
        confirmBtn = null;
    }

    modalContainer.removeChild(modalContainer.firstChild);
    modalContainer.style.display = 'none';
}

function editTaskClick () {
    const title = document.querySelector('.edit-task-form #title').value;
    const description = document.querySelector('.edit-task-form #description').value;
    const category = document.querySelector('.edit-task-form [name="category"]:checked').value;
    const deadline = document.querySelector('.edit-task-form #deadline').value;
    const estimationTotal = document.querySelectorAll('.edit-task-form [name="estimation"]:checked').length;
    const priority = document.querySelector('.edit-task-form [name="priority"]:checked').value;

    PubSub.publish('model/UpdateTask', {
        id: thisTask.id,
        title,
        description,
        estimationTotal,
        category,
        priority,
        deadline
    });

    hideModal();
}


function selectTaskToDelete (task) {
    if (tasksToDelete.indexOf(task) !== -1) {
        task.classList.remove('active-remove');
        tasksToDelete.splice(tasksToDelete.indexOf(task), 1);
        PubSub.publish('tasks-to-delete-changed', tasksToDelete.length);

        return;
    }

    if (tasksToDelete.indexOf(task) === -1) {
        tasksToDelete.push(task);
        task.classList.add('active-remove');
        PubSub.publish('tasks-to-delete-changed', tasksToDelete.length);
    }
}

function renderAddTaskModal () {
    modalContainer.style.display = 'block';
    modalContainer.innerHTML = Modals.renderAddItem();

    $('.add-task-form #deadline').datepicker({
        showOtherMonths: true,
        dateFormat: 'yy-mm-dd'
    });

    canselBtn = document.querySelector('.add-task-form .actions .cansel');
    confirmBtn = document.querySelector('.add-task-form .actions .confirm');

    canselBtn.addEventListener('click', hideModal);
    confirmBtn.addEventListener('click', addTaskClick);
}

function addTaskClick () {
    const title = document.querySelector('.add-task-form #title').value;
    const description = document.querySelector('.add-task-form #description').value;
    const category = document.querySelector('.add-task-form [name="category"]:checked').value;
    const deadline = document.querySelector('.add-task-form #deadline').value;
    const estimationTotal = document.querySelectorAll('.add-task-form [name="estimation"]:checked').length;
    const priority = document.querySelector('.add-task-form [name="priority"]:checked').value;

    PubSub.publish('model/AddNewTask', {
        title,
        description,
        estimationTotal,
        category,
        priority,
        deadline
    });
    hideModal();
}


function initUrgencyFilter (fragment) {
    const urgencyBtns = fragment.querySelectorAll('.categories-nav > ul > li > a');

    urgencyBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();

        urgencyBtns.forEach((btn) => {
            btn.classList.remove('selected');
        });

        const link = e.target;
        link.classList.add('selected');

        PubSub.publish('model/urgencySort', btn.innerText.toLocaleLowerCase());
    }));
}

function deleteItemsHandle (isDeleteOn) {
    if (!isDeleteOn) {
        const main = document.querySelector('.main-content');
        main.classList.remove('remove-item');
        if (tasksToDelete.length !== 0) {
            tasksToDelete.forEach(task => task.classList.remove('active-remove'));
            tasksToDelete = tasksToDelete.map(task => task.dataset.id);
            renderRUSureModal();
        }

        return;
    }
    if (isDeleteOn) {
        const main = document.querySelector('.main-content');
        main.classList.add('remove-item');
    }
}

function initDoneNav (fragment) {
    const doneNav = fragment.querySelectorAll('.pages-nav > ul > li > a');

    doneNav[0].addEventListener('click', (e) => {
        e.preventDefault();

        doneNav.forEach(nav => nav.classList.remove('selected'));
        e.target.classList.add('selected');

        PubSub.publish('model/getDailyTasks');
    });

    doneNav[1].addEventListener('click', (e) => {
        e.preventDefault();

        doneNav.forEach(nav => nav.classList.remove('selected'));
        e.target.classList.add('selected');

        PubSub.publish('model/getDoneDailyTasks');
    });
}

let removeFormBtn;
let canselFormBtn;
function renderRUSureModal () {
    modalContainer.style.display = 'block';
    modalContainer.innerHTML = Modals.renderDeleteItem();

    canselFormBtn = document.querySelector('.form-btns-container .form-cansel');
    removeFormBtn = document.querySelector('.form-btns-container .form-remove');
    canselBtn = document.querySelector('.remove-task-form .actions .cansel');

    canselBtn.addEventListener('click', hideRUSureModal);
    canselFormBtn.addEventListener('click', hideRUSureModal);
    removeFormBtn.addEventListener('click', removingConfirmClick);
}

function hideRUSureModal () {
    tasksToDelete = [];
    PubSub.publish('tasks-to-delete-changed', 0);

    canselBtn.removeEventListener('click', hideRUSureModal);
    canselFormBtn.removeEventListener('click', hideRUSureModal);
    removeFormBtn.removeEventListener('click', removingConfirmClick);

    modalContainer.removeChild(modalContainer.firstChild);
    modalContainer.style.display = 'none';
}

function removingConfirmClick () {
    PubSub.publish('model/deleteItems', tasksToDelete);
    hideRUSureModal();
}

/*
PubSub.publish('model/deleteItems', [thisTask.id.toString()]);

  canselBtn = document.querySelector('.add-task-form .actions .cansel');
  confirmBtn = document.querySelector('.add-task-form .actions .confirm');

  canselBtn.addEventListener('click', hideModal);
  confirmBtn.addEventListener('click', addTaskClick); */

