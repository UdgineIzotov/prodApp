/**
 * @module TasksModule
 */
/** Creates Task */
export class Task {
    constructor (title, description, estimation, category, priority, deadline) {
        this.id = (new Date()).getTime();
        this.title = title;
        this.description = description;
        this.estimationTotal = estimation;
        this.estimationSucced = 0;
        this.estimationFailed = 0;
        this.category = category;
        this.priority = priority;

        this.deadline = deadline;
        this.isDone = false;
    }
}
