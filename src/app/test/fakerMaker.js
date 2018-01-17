const numberOfTasksDone = 2;
const numberOfTasksDaily = 3;
const numberOfTasksGlobal = 10;

const faker = require('faker');

const categories = ['work', 'education', 'hobby', 'sport', 'other'];
const urgency = ['low', 'middle', 'hight', 'urgent'];
const now = new Date(Date.now());
const nearFuture = new Date(Date.now() + 7 * 24 * 3600 * 1000);
const nearPast = new Date(Date.now() - 3 * 24 * 3600 * 1000);
const lastMonth = new Date(Date.now() - 31 * 24 * 3600 * 1000);

function createTask () {
    const task = {};

    task.id = faker.finance.account();
    task.title = faker.lorem.sentence(5);
    task.description = faker.lorem.sentence(12);
    task.estimationTotal = faker.random.number({ min: 2, max: 5 });
    task.estimationSucced = 0;
    task.estimationFailed = 0;
    task.category = faker.random.arrayElement(categories);
    task.priority = faker.random.arrayElement(urgency);

    task.deadline = faker.date.between(task.createDate, nearFuture);
    task.deadline.setHours(0);
    task.deadline.setMinutes(0);
    task.deadline.setSeconds(0);
    task.deadline.setMilliseconds(0);

    return task;
}

function createTaskDone () {
    const task = createTask();
    task.createDate = faker.date.between(lastMonth, now);
    task.startDate = faker.date.between(task.createDate, now);
    task.deadline = faker.date.between(task.createDate, now);
    task.estimationSucced = faker.random.number({ min: 1, max: task.estimationTotal });
    task.estimationFailed = faker.random.number({ min: 0, max: task.estimationTotal - task.estimationSucced });
    task.isDone = true;
    return task;
}


function createTaskGlobal () {
    const task = createTask();
    task.createDate = faker.date.between(nearPast, now);
    task.startDate = null;
    task.deadline = faker.date.between(task.createDate, nearFuture);
    task.deadline.setHours(0);
    task.deadline.setMinutes(0);
    task.deadline.setSeconds(0);
    task.deadline.setMilliseconds(0);
    task.isDone = false;
    return task;
}

function createTaskDaily () {
    const task = createTaskGlobal();
    task.startDate = now;
    return task;
}

export const tasks = [];

for (let i = 0; i < 60; i++) {
    tasks.push(createTaskDone());
}
/* Creating task list *//*
for (let i = 0; i < numberOfTasksDaily; i += 1) {
  tasks.push(createTaskDaily())
}

for (let i = 0; i < numberOfTasksDone; i += 1) {
  tasks.push(createTaskDone())
}

for (let i = 0; i < numberOfTasksGlobal; i += 1) {
  tasks.push(createTaskGlobal())
}
*/
console.dir(tasks);
console.log(`Created: ${tasks.length} tasks`);
