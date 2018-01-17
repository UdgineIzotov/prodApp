import { TimerModel } from './timer.model';
import { fireDataBase } from '../../model/objectDAO';

describe('timer model tests', () => {
    const timerMock = () => {};
    const defaultSettings = {
        workTime: 15,
        workIteration: 4,
        shortBreak: 4,
        longBreak: 25
    };
    const thenFacker = {
        then: (cb) => {
            cb({ val: () => 1 });
        }
    };

    beforeEach(() => {
        TimerModel.currentTask = {
            id: 1,
            estimationFailed: 0,
            estimationSucced: 0,
            estimationTotal: 5,
            isDone: false
        };

        TimerModel.settings = null;
    });

    it('shold call fireDataBase.getTask on getTask ', (cb) => {
        spyOn(fireDataBase, 'getTask').and.returnValue(thenFacker);

        TimerModel.getTask(1);

        expect(fireDataBase.getTask).toHaveBeenCalled();

        cb();
    });

    it('should get settings from sessionStorage in first time on getWorkingTime', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(defaultSettings));

        TimerModel.getWorkingTime();

        expect(sessionStorage.getItem).toHaveBeenCalledWith('settings');
    });

    it('should get settings from sessionStorage in first time on getShortBreaktime', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(defaultSettings));

        TimerModel.getShortBreaktime();

        expect(sessionStorage.getItem).toHaveBeenCalledWith('settings');
    });

    it('should get settings from sessionStorage in first time on getLongBreak', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(defaultSettings));

        TimerModel.getLongBreak();

        expect(sessionStorage.getItem).toHaveBeenCalledWith('settings');
    });

    it('should get settings from sessionStorage in first time on getIterationsCount', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(defaultSettings));

        TimerModel.getIterationsCount();

        expect(sessionStorage.getItem).toHaveBeenCalledWith('settings');
    });

    it('should call fireDataBase.setTask on failPomodoro', () => {
        const task = Object.assign({}, TimerModel.currentTask);
        task.estimationFailed++;

        spyOn(fireDataBase, 'setTask');

        TimerModel.failPomodoro();

        expect(fireDataBase.setTask).toHaveBeenCalledWith(task.id, task);
    });

    it('should call fireDataBase.setTask on succeedPomodoro', () => {
        const task = Object.assign({}, TimerModel.currentTask);
        task.estimationSucced++;

        spyOn(fireDataBase, 'setTask');

        TimerModel.succeedPomodoro();

        expect(fireDataBase.setTask).toHaveBeenCalledWith(task.id, task);
    });

    it('should call fireDataBase.setTask on doneTask', () => {
        const task = Object.assign({}, TimerModel.currentTask);
        task.isDone = true;

        spyOn(fireDataBase, 'setTask');

        TimerModel.doneTask();

        expect(fireDataBase.setTask).toHaveBeenCalledWith(task.id, task);
    });

    it('should return expected value on isTaskDone', () => {
        expect(typeof TimerModel.isTaskDone()).toBe('boolean');
        expect(TimerModel.isTaskDone()).toBeFalse;

        TimerModel.currentTask.estimationSucced = TimerModel.currentTask.estimationTotal;

        expect(TimerModel.isTaskDone()).toBeTrue;
    });

    it('should return expected value on isFailed', () => {
        expect(typeof TimerModel.isFailed()).toBe('boolean');
        expect(TimerModel.isFailed()).toBeFalse;

        TimerModel.currentTask.estimationSucced = 2;
        TimerModel.currentTask.estimationFailed = 3;

        expect(TimerModel.isFailed()).toBeTrue;
    });

    it('should return expected value on isSucced', () => {
        expect(typeof TimerModel.isSucced()).toBe('boolean');
        expect(TimerModel.isSucced()).toBeFalse;

        TimerModel.currentTask.estimationSucced = 3;
        TimerModel.currentTask.estimationFailed = 2;

        expect(TimerModel.isSucced()).toBeTrue;
    });

    it('should try to get value from sessionStorage on incPomodoroIterations', () => {
        spyOn(sessionStorage, 'getItem');

        TimerModel.incPomodoroIterations();

        expect(sessionStorage.getItem).toHaveBeenCalledWith('pomodoroIterations');
    });

    it('should set value to sessionStorage on incPomodoroIterations', () => {
        spyOn(sessionStorage, 'setItem');

        let iterationsCount = sessionStorage.getItem('pomodoroIterations') || 0;
        iterationsCount++;

        TimerModel.incPomodoroIterations();

        expect(sessionStorage.setItem).toHaveBeenCalledWith('pomodoroIterations', iterationsCount);
    });

    it('should return true on isLongBreak ', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(12);
        spyOn(TimerModel, 'getIterationsCount').and.returnValue(4);

        expect(typeof TimerModel.isLongBreak()).toBe('boolean');
        expect(TimerModel.isLongBreak()).toBeTrue;
    });

    it('should return false on isLongBreak ', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(11);
        spyOn(TimerModel, 'getIterationsCount').and.returnValue(4);

        expect(typeof TimerModel.isLongBreak()).toBe('boolean');
        expect(TimerModel.isLongBreak()).toBeFalse;
    });
});
