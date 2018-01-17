import { Task } from './Task';

describe('task class tests', () => {
    it('should create the task', () => {
        const deadline = new Date('01-01-2001');

        const task = {
            title: 'Task',
            description: 'Description',
            estimationTotal: 5,
            estimationSucced: 0,
            estimationFailed: 0,
            category: 'work',
            priority: 'low',
            deadline
        };

        const createdTask = new Task(
            task.title,
            task.description,
            task.estimationTotal,
            task.category,
            task.priority,
            task.deadline
        );

        expect(createdTask).toBeObject;

        expect(task.title === createdTask.title &&
      task.description === createdTask.description &&
      task.estimationTotal === createdTask.estimationTotal &&
      task.category === createdTask.category &&
      task.priority === createdTask.priority &&
      task.deadline === createdTask.deadline)
            .toBe(true);
    });
});
