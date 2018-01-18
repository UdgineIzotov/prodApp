/**
 * @module TasksModule
 */
/** Creates Task */
export class Task {
    constructor (
        id,
        title,
        description,
        category,
        priority,
        deadline,
        estimationTotal,
        estimationSucced,
        estimationFailed
    ) {
        console.dir(arguments);
        this.id = id;
        this.title = title;
        this.description = description;
        this.estimationTotal = estimationTotal;
        this.estimationSucced = estimationSucced || 0;
        this.estimationFailed = estimationFailed || 0;
        this.category = category;
        this.priority = priority;

        this.deadline = new Date(deadline);
        console.log('creating a task:', deadline, this.deadline);
        this.isDone = false;
    }
}
