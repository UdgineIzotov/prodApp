import { PubSub } from '../../Pubsub';
import TaskListView from './tasks-list';
/**
 * @module TaskListPage
 */
export const taskListController = (function () {
    PubSub.subscribe('model/requestTasksDataFinish', TaskListView.renderTaskLists.bind(TaskListView));
    PubSub.subscribe('model/TasksUpdated', TaskListView.renderTaskLists.bind(TaskListView));
    PubSub.subscribe('TaskListPage/DailyTaskListRender', TaskListView.renderDailyList.bind(TaskListView));
    PubSub.subscribe('TaskListPage/GlobalTaskListsRender', TaskListView.renderGlobalList.bind(TaskListView));
    PubSub.subscribe('TaskListPage/DoneTaskList', TaskListView.renderDailyList.bind(TaskListView));

    PubSub.subscribe('header/add-btn-click', TaskListView.renderAddTask.bind(TaskListView));

    PubSub.subscribe('model/getTaskIdSucceeded', TaskListView.renderEditTaskModal.bind(TaskListView));

    PubSub.subscribe('delete-items-view', (items) => {
        const taskToDeleteIDs = items.map(task => task.dataset.id);

        PubSub.publish('model/deleteItems', taskToDeleteIDs);
    });
    PubSub.subscribe('delete-items-pressed', TaskListView.deleteItemsHandle.bind(TaskListView));
})();

