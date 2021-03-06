import { PubSub } from '../Pubsub';

import { Task } from './Task';
import { fireDataBase } from './objectDAO';

/**
 * Class that operates with tasks localy
 * @memberof module:TasksModule
 */
class DataStorageInstanse {
    constructor () {
    // if (DataStorage) {
    //     return DataStorage;
    // }

        this.tasks = [];
        this.categories = ['work', 'education', 'hobby', 'sport', 'other'];
    }

    /**
   * requesting tasks from firebase
   */
    requestTasksData () {
        const tasks = [];

        fireDataBase.getTasks().then((data) => {
            data.forEach(task => tasks.push(new Task(
                task.id,
                task.title,
                task.description,
                task.category,
                task.priority,
                task.deadline,
                task.estimationTotal,
                task.estimationSucced
            )));

            DataStorage.tasks = tasks;
            PubSub.publish('model/requestTasksDataFinish', tasks.length);
        });
    }

    /**
   * sets task to firebase and localy
   * @param {object} task
   */
    setTask (task) {
        console.log('setTask:', task.title);
        /* istanbul ignore next:tests with another test */
        const newTask = new Task(
            (new Date()).getTime(),
            task.title,
            task.description,
            task.category,
            task.priority,
            task.deadline,
            task.estimationTotal
        );

        /* istanbul ignore next:simple operation */
        fireDataBase.setTask(newTask);

        /* istanbul ignore next:simple operation */
        DataStorage.tasks.push(newTask);

        PubSub.publish('render/Notification', { type: 'success', message: 'New task has been created!' });
        PubSub.publish('model/TasksUpdated');
    }
    /**
   * updates task on firebase and localy
   * @param {object} task
   */
    updateTask (task) {
    /* istanbul ignore next */
        console.log('updating task :', task);

        /* istanbul ignore next */
        const taskToUpdate = DataStorage.tasks.filter(item => item.id.toString() === task.id.toString())[0];

        /* istanbul ignore next */
        taskToUpdate.title = task.title;
        /* istanbul ignore next */
        taskToUpdate.description = task.description;
        /* istanbul ignore next */
        taskToUpdate.estimationTotal = task.estimationTotal;
        /* istanbul ignore next */
        taskToUpdate.category = task.category;
        /* istanbul ignore next */
        taskToUpdate.priority = task.priority;
        /* istanbul ignore next */
        taskToUpdate.deadline = new Date(task.deadline);

        fireDataBase.setTask(taskToUpdate);

        PubSub.publish('render/Notification', { type: 'success', message: 'Task has been updated!' });
        PubSub.publish('model/TasksUpdated');
    }
    /**
   * deletes task from firebase
   * @param {object} task
   */
    deleteTask (taskId) {
        fireDataBase.deleteTask(taskId);
    }

    /**
   * notify with DoneTasks array
   */
    getDoneTasks () {
        PubSub.publish('TaskListPage/DoneTaskList', DataStorage.tasks.filter(task => task.isDone));
    }

    /**
   * notify with DailyTasks array
   */
    getDailyTasks () {
        console.log('/******** GET DAILY TASKS ********/');

        const tasks = DataStorage.tasks.filter((task) => {
            const Daily = isDaily(task);
            const Done = !task.isDone;
            console.log(task.id, Daily, Done);
            return Daily && Done;
        });

        console.dir(tasks);
        console.dir(DataStorage.tasks);
        if (tasks.length === 0) {
            PubSub.publish('TaskListPage/NoDailyTasks');
            return;
        }

        PubSub.publish('TaskListPage/DailyTaskListRender', tasks);
        console.log('/******** ENDING GET DAILY TASKS ********/');
    }

    /**
   * notify with GlobalTasks array
   */
    getGlobalTasks () {
        const tasks = getSortedByCategory(DataStorage.categories, DataStorage.tasks);

        PubSub.publish('TaskListPage/GlobalTaskListsRender', tasks);
    }

    /**
   * notify with specific task
   * @param {number} id
   */
    getTaskById (id) {
        const task = DataStorage.tasks.filter(task => task.id === +id)[0];

        PubSub.publish('model/getTaskIdSucceeded', task);
    }

    /**
   * deletes tasks with id from array
   * @param {array} ids - tasks ids to be deleted
   */
    deleteTasksById (ids) {
        console.dir('ping');
        const tasksDeleteFromFire = [];

        DataStorage.tasks = DataStorage.tasks.filter((task) => {
            if (ids.indexOf(task.id.toString()) !== -1) {
                tasksDeleteFromFire.push(task);
                return false;
            }

            return true;
        });

        tasksDeleteFromFire.forEach(task => DataStorage.deleteTask(task.id));

        PubSub.publish('render/Notification', { type: 'success', message: 'Task(s) has been removed!' });
        PubSub.publish('model/TasksUpdated');
    }

    /**
   * moves task to daily tasks
   * @param {number} id
   */
    makeTaskDaily (id) {
        const task = DataStorage.tasks.filter(task => task.id === +id)[0];

        task.deadline = new Date();

        console.dir(task);

        DataStorage.updateTask(task);

        PubSub.publish('render/Notification', { type: 'success', message: 'Task has been updated!' });
        PubSub.publish('model/TasksUpdated');
    }

    /**
   * set task to finished
   * @param {number} id
   */
    taskFinished (id) {
        const task = DataStorage.tasks.filter(task => task.id === +id)[0];

        task.isDone = true;

        const updates = {};
        updates[`/tasks/${task.id}`] = task;

        DataStorage.db.ref().update(updates);
    }

    /**
   * sorts tasks by urgenry
   * @param {String} urgency
   */
    sortByUrgency (urgency) {
        if (urgency === 'all') {
            PubSub.publish(
                'TaskListPage/GlobalTaskListsRender',
                getSortedByCategory(DataStorage.categories, DataStorage.tasks)
            );

            return;
        }

        const tasks = DataStorage.tasks.filter(task => task.priority === urgency);

        PubSub.publish('TaskListPage/GlobalTaskListsRender', getSortedByCategory(DataStorage.categories, tasks));
    }
}

export const DataStorage = new DataStorageInstanse();

/* istanbul ignore next */PubSub.subscribe('model/requestTasksData', DataStorage.requestTasksData);
/* istanbul ignore next */PubSub.subscribe('model/AddNewTask', DataStorage.setTask);
/* istanbul ignore next */PubSub.subscribe('model/UpdateTask', DataStorage.updateTask);
/* istanbul ignore next */PubSub.subscribe('model/taskToDaily', DataStorage.makeTaskDaily);

/* istanbul ignore next */PubSub.subscribe('model/getDailyTasks', DataStorage.getDailyTasks);
/* istanbul ignore next */PubSub.subscribe('model/getGlobalTasks', DataStorage.getGlobalTasks);
/* istanbul ignore next */PubSub.subscribe('model/getTaskByIdForEditing', DataStorage.getTaskById);
/* istanbul ignore next */PubSub.subscribe('model/getDoneDailyTasks', DataStorage.getDoneTasks);

/* istanbul ignore next */PubSub.subscribe('model/urgencySort', DataStorage.sortByUrgency);


/* istanbul ignore next */PubSub.subscribe('model/deleteItems', DataStorage.deleteTasksById);

/* istanbul ignore next */PubSub.subscribe('model/taskFinish', DataStorage.taskFinished);


export function getSortedByCategory (categories, tasks) {
    const resTasks = [];

    categories.forEach((category) => {
        resTasks.push({
            category,
            tasks: tasks.filter(task => !isDaily(task) && task.category === category)
        });
    });

    return resTasks;
}

export function isDaily (task) {
    const nowDate = new Date();
    const deadline = new Date(task.deadline);

    return deadline.getFullYear() === nowDate.getFullYear() &&
    deadline.getMonth() === nowDate.getMonth() &&
    deadline.getDate() === nowDate.getDate();
}

