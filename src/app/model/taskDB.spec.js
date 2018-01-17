import { DataStorage } from './taskDB';
import { fireDataBase } from './objectDAO';
import { PubSub } from '../Pubsub';

import { isDaily } from './taskDB';
import { getSortedByCategory } from './taskDB';


describe('tasks model tests', () => {
    function emptyMock () {
        return null;
    }

    function getTasksMock () {
        return new Promise(() => [1, 2, 3]);
    }

    const thenFaker = { then: cb => cb([1, 2, 3]) };

    it('should call the firebase request on requestDataTask', () => {
        spyOn(fireDataBase, 'getTasks').and.callFake(getTasksMock);
        DataStorage.requestTasksData();

        expect(fireDataBase.getTasks).toHaveBeenCalled();
    });

    it('should notify the PubSub on requestDataTask', (cb) => {
        spyOn(PubSub, 'publish');
        spyOn(fireDataBase, 'getTasks').and.returnValue(thenFaker);
        DataStorage.requestTasksData();

        expect(PubSub.publish).toHaveBeenCalledWith('model/requestTasksDataFinish', 3);

        cb();
    });

    it('should call fireDataBase on setTask', () => {
        spyOn(fireDataBase, 'setTask').and.callFake(emptyMock);

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.setTask(task);

        expect(fireDataBase.setTask).toHaveBeenCalled();
    });

    it('should call PubSub.publish for sending notification on setTask', () => {
        spyOn(PubSub, 'publish');

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.setTask(task);

        expect(PubSub.publish)
            .toHaveBeenCalledWith('render/Notification', { type: 'success', message: 'New task has been created!' });
    });

    it('should call PubSub.publish with TasksUpdated on setTask', (cb) => {
        spyOn(PubSub, 'publish');

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.setTask(task);

        expect(PubSub.publish)
            .toHaveBeenCalledWith('model/TasksUpdated');

        cb();
    });

    it('should call setTask of fireDataBase on updateTask', () => {
        spyOn(fireDataBase, 'setTask').and.callFake(emptyMock);


        const task = {
            id: 1,
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.tasks.push(task);

        DataStorage.updateTask(task);

        expect(fireDataBase.setTask).toHaveBeenCalled();
    });

    it('should call PubSub.publish with TasksUpdated on updateTask', () => {
        spyOn(PubSub, 'publish');

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.updateTask(task);

        expect(PubSub.publish)
            .toHaveBeenCalledWith('model/TasksUpdated');
    });

    it('should call PubSub.publish for sending notification on updateTask', () => {
        spyOn(PubSub, 'publish');

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline: '01-01-2001'
        };

        DataStorage.updateTask(task);

        expect(PubSub.publish)
            .toHaveBeenCalledWith('render/Notification', { type: 'success', message: 'Task has been updated!' });
    });

    it('should call fireBase.deletetask on deleteTask', () => {
        spyOn(fireDataBase, 'deleteTask').and.callFake(emptyMock);

        DataStorage.deleteTask(12);

        expect(fireDataBase.deleteTask).toHaveBeenCalled();
    });

    it('should call PubSub with data on getDoneTasks', () => {
        DataStorage.tasks.push([
            { id: 1, isDone: false },
            { id: 2, isDone: true },
            { id: 3, isDone: false }]);


        spyOn(PubSub, 'publish');

        DataStorage.getDoneTasks();

        expect(PubSub.publish)
            .toHaveBeenCalledWith('TaskListPage/DoneTaskList', DataStorage.tasks.filter(task => task.isDone));
    });

    it('should work helper function isDaily', () => {
        expect(isDaily({ deadline: new Date() })).toBe(true);
        expect(isDaily({ deadline: new Date('01-01-1980') })).toBe(false);
    });

    it('should call PubSub.publish on getDaily with no tasks', () => {
        spyOn(PubSub, 'publish');

        const nowDate = new Date();

        DataStorage.tasks.push([
            { id: 1, deadline: nowDate, isDone: true },
            { id: 2, deadline: new Date('01-01-1985'), isDone: true },
            { id: 3, deadline: nowDate, isDone: true }]);


        DataStorage.getDailyTasks();

        expect(PubSub.publish).toHaveBeenCalledWith('TaskListPage/NoDailyTasks');
    });

    it('should call PubSub.publish on getDaily with some tasks', () => {
        spyOn(PubSub, 'publish');

        const nowDate = new Date();

        DataStorage.tasks.push(
            { id: 1, deadline: new Date(), isDone: true },
            { id: 2, deadline: new Date(), isDone: false },
            { id: 3, deadline: new Date(), isDone: false }
        );

        const tasks = DataStorage.tasks.filter(task => isDaily(task) && !task.isDone);
        console.dir(isDaily(DataStorage.tasks[1]));
        DataStorage.getDailyTasks();

        expect(PubSub.publish).toHaveBeenCalledWith('TaskListPage/DailyTaskListRender', tasks);
    });

    it('should work helper function getSortedByCategory', () => {
        const tasks = [
            { id: 1, category: 'work', isDone: true },
            { id: 2, category: 'sport', isDone: false },
            { id: 3, category: 'hobby', isDone: false }];


        const sortedTasks = getSortedByCategory(DataStorage.categories, tasks);

        const expectedResult = [
            { category: 'work', tasks: [{ id: 1, category: 'work', isDone: true }] },
            { category: 'education', tasks: [] },
            { category: 'hobby', tasks: [{ id: 3, category: 'hobby', isDone: false }] },
            { category: 'sport', tasks: [{ id: 2, category: 'sport', isDone: false }] },
            { category: 'other', tasks: [] }];

        expect(sortedTasks).toEqual(expectedResult);
    });

    it('should call PubSub.publish with sorted data on getGlobalTasks ', () => {
        const tasks = [
            { id: 1, category: 'work', isDone: true },
            { id: 2, category: 'sport', isDone: false },
            { id: 3, category: 'hobby', isDone: false }];

        DataStorage.tasks = tasks;

        const sortedTasks = getSortedByCategory(DataStorage.categories, tasks);

        spyOn(PubSub, 'publish');

        DataStorage.getGlobalTasks();

        expect(PubSub.publish).toHaveBeenCalledWith('TaskListPage/GlobalTaskListsRender', sortedTasks);
    });

    it('should call PubSub.publish with found task on getTaskById', () => {
        const tasks = [
            { id: 1, category: 'work', isDone: true },
            { id: 2, category: 'sport', isDone: false },
            { id: 3, category: 'hobby', isDone: false }];

        DataStorage.tasks = tasks;
        spyOn(PubSub, 'publish');

        DataStorage.getTaskById(2);

        expect(PubSub.publish).toHaveBeenCalledWith('model/getTaskIdSucceeded', { id: 2, category: 'sport', isDone: false });
    });

    it('should call DataStorage.deleteTask and delete tasks from tasks list on deleteTasksById ', () => {
        const tasks = [
            { id: 1, category: 'work', isDone: true },
            { id: 2, category: 'sport', isDone: false },
            { id: 3, category: 'hobby', isDone: false },
            { id: 4, category: 'hobby', isDone: false }];

        const ids = ['1', '3'];

        DataStorage.tasks = tasks;

        tasks.forEach((task) => {
            const isAvailable = ids.indexOf(task.id.toString());
        });

        spyOn(DataStorage, 'deleteTask').and.callFake(emptyMock);

        DataStorage.deleteTasksById(['1', '2']);

        expect(DataStorage.deleteTask).toHaveBeenCalled();
        expect(DataStorage.tasks.length).toEqual(2);
    });

    it('should call DataStorage.makeTaskDaily with daily task on makeItDaily', () => {
        const tasks = [{
            id: 1, category: 'work', deadline: new Date('01-01-2018'), isDone: true
        }];

        DataStorage.tasks = tasks;

        spyOn(DataStorage, 'updateTask').and.callFake(emptyMock);

        DataStorage.makeTaskDaily(1);

        expect(DataStorage.updateTask).toHaveBeenCalled();
    });

    it('should update db with task on taskFinished', () => {
        const tasks = [{ id: 1, category: 'work', isDone: false }];

        const dbMock = { ref: () => dbMock, update: () => dbMock };
        DataStorage.tasks = tasks;
        DataStorage.db = dbMock;

        spyOn(dbMock, 'ref').and.callThrough();
        spyOn(dbMock, 'update').and.callThrough();

        const task = { id: 1, category: 'work', isDone: true };

        const updates = {};
        updates[`/tasks/${task.id}`] = task;


        DataStorage.taskFinished(1);

        expect(DataStorage.db.ref().update).toHaveBeenCalledWith(updates);
    });

    it('should call Pubsub.publish in case of all on sortByUrgency', () => {
        const tasks = [
            { id: 1, category: 'work', isDone: true },
            { id: 2, category: 'sport', isDone: false },
            { id: 3, category: 'hobby', isDone: false }];

        DataStorage.tasks = tasks;

        spyOn(PubSub, 'publish');


        DataStorage.sortByUrgency('all');

        expect(PubSub.publish)
            .toHaveBeenCalledWith(
                'TaskListPage/GlobalTaskListsRender',
                getSortedByCategory(DataStorage.categories, DataStorage.tasks)
            );
    });

    it('should call Pubsub.publish in case of some urgency on sortByUrgency', () => {
        const tasks = [
            {
                id: 1, category: 'work', priority: 'low', isDone: true
            },
            {
                id: 2, category: 'sport', priority: 'urgent', isDone: false
            },
            {
                id: 3, category: 'hobby', priority: 'low', isDone: false
            }];

        DataStorage.tasks = tasks;

        spyOn(PubSub, 'publish');


        const tasksToSort = DataStorage.tasks.filter(task => task.priority === 'low');

        DataStorage.sortByUrgency('low');

        expect(PubSub.publish)
            .toHaveBeenCalledWith(
                'TaskListPage/GlobalTaskListsRender',
                getSortedByCategory(DataStorage.categories, tasksToSort)
            );
    });
});

