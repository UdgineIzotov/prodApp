import SettingsView from './pages/settings/SettingsView';
import TaskListView from './pages/tasks-list/tasks-list';
import TimerView from './pages/timer/timer.view';
import StatisticsView from './pages/statistics/statistics.view';
import test from './test/test';


export const routingData = [
    {
        re: /settings/,
        handler: SettingsView.render.bind(SettingsView)
    },
    {
        re: /task-list/,
        handler: TaskListView.render.bind(TaskListView)
    },
    {
        re: /timer/,
        handler: TimerView.render.bind(TimerView)
    },
    {
        re: /statistics/,
        handler: StatisticsView.render.bind(StatisticsView)
    },
    {
        re: /test/,
        handler: test
    }
];

export const defaultRoute = { re: 'task-list', handler: TaskListView.render };

