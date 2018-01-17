import { statisticsModel } from './statistics.model';

describe('statistics model tests', () => {
    const optionObj = { time: 'Day', type: 'Tasks' };
    const emptyMock = () => {
    };


    beforeEach(() => {
        statisticsModel.tasks = [
            {
                id: 1, estimationFailed: 3, estimationSucced: 2, priority: 'low', deadline: new Date('01-01-2015')
            },
            {
                id: 2, estimationFailed: 2, estimationSucced: 3, priority: 'hight', deadline: new Date('01-02-2015')
            },
            {
                id: 3, estimationFailed: 2, estimationSucced: 3, priority: 'middle', deadline: new Date('01-03-2015')
            },
            {
                id: 4, estimationFailed: 3, estimationSucced: 2, priority: 'urgent', deadline: new Date('01-04-2015')
            },
            {
                id: 5, estimationFailed: 2, estimationSucced: 3, priority: 'hight', deadline: new Date('01-05-2015')
            },
            {
                id: 6, estimationFailed: 2, estimationSucced: 3, priority: 'urgent', deadline: new Date('01-06-2015')
            },
            {
                id: 7, estimationFailed: 3, estimationSucced: 2, priority: 'middle', deadline: new Date('01-07-2015')
            },
            {
                id: 8, estimationFailed: 2, estimationSucced: 3, priority: 'urgent', deadline: new Date('01-08-2015')
            },
            {
                id: 9, estimationFailed: 3, estimationSucced: 2, priority: 'low', deadline: new Date('01-09-2015')
            },
            {
                id: 10, estimationFailed: 2, estimationSucced: 3, priority: 'low', deadline: new Date('01-10-2015')
            },
            {
                id: 11, estimationFailed: 2, estimationSucced: 3, priority: 'urgent', deadline: new Date('01-11-2015')
            },
            {
                id: 12, estimationFailed: 3, estimationSucced: 2, priority: 'hight', deadline: new Date('01-12-2015')
            },
            {
                id: 13, estimationFailed: 2, estimationSucced: 3, priority: 'urgent', deadline: new Date('01-13-2015')
            },
            {
                id: 14, estimationFailed: 3, estimationSucced: 2, priority: 'low', deadline: new Date('01-14-2015')
            },
            {
                id: 15, estimationFailed: 2, estimationSucced: 3, priority: 'middle', deadline: new Date('01-15-2015')
            },
            {
                id: 16, estimationFailed: 3, estimationSucced: 2, priority: 'urgent', deadline: new Date('01-16-2015')
            }
        ];
    });

    it('should return undefined on getGroupedData call with unproper data', () => {
        expect(statisticsModel.getGroupedData({})).toBeUndefined();
        expect(statisticsModel.getGroupedData({ time: 'notProperValue' })).toBeUndefined();
    });

    it('should call proper func on getGroupedData ', () => {
        const options = optionObj;
        spyOn(statisticsModel, 'getDailyTasks').and.callFake(emptyMock);
        spyOn(statisticsModel, 'getDailyPomodoros').and.callFake(emptyMock);
        spyOn(statisticsModel, 'getWeeklyTasks').and.callFake(emptyMock);
        spyOn(statisticsModel, 'getWeeklyPomodoros').and.callFake(emptyMock);
        spyOn(statisticsModel, 'getMonthlyTasks').and.callFake(emptyMock);
        spyOn(statisticsModel, 'getMonthlyPomodoros').and.callFake(emptyMock);

        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getDailyTasks).toHaveBeenCalled();

        options.type = 'Pomodoros';
        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getDailyPomodoros).toHaveBeenCalled();

        options.time = 'Week';
        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getWeeklyPomodoros).toHaveBeenCalled();

        options.type = 'Tasks';
        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getWeeklyTasks).toHaveBeenCalled();

        options.time = 'Month';
        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getMonthlyTasks).toHaveBeenCalled();

        options.type = 'Pomodoros';
        statisticsModel.getGroupedData(options);

        expect(statisticsModel.getMonthlyPomodoros).toHaveBeenCalled();
    });

    it('should return sorted tasks on getDailyTasks', () => {
        const expecedResult = {
            failed: 7,
            hight: 2,
            low: 1,
            middle: 2,
            urgent: 4
        };


        expect(statisticsModel.getDailyTasks()).toEqual(expecedResult);
    });

    it('should return sorted tasks on getDailyPomodoros', () => {
        const expecedResult = {
            failed: 39,
            hight: 8,
            low: 9,
            middle: 8,
            urgent: 16
        };

        expect(statisticsModel.getDailyPomodoros()).toEqual(expecedResult);
    });

    it('should return sorted tasks on getWeeklyPomodoros', () => {
        const expecedResult = {
            failed: [5, 4, 6, 7, 8, 4, 5],
            hight: [5, 0, 0, 0, 3, 0, 0],
            low: [0, 0, 2, 2, 2, 3, 0],
            middle: [0, 0, 2, 3, 0, 3, 0],
            urgent: [0, 6, 0, 3, 2, 0, 5]
        };

        expect(statisticsModel.getWeeklyPomodoros()).toEqual(expecedResult);
    });

    it('should return sorted tasks on getWeeklyTasks', () => {
        const expecedResult = {
            failed: [1, 0, 2, 1, 2, 0, 1],
            hight: [1, 0, 0, 0, 1, 0, 0],
            low: [0, 0, 0, 0, 0, 1, 0],
            middle: [0, 0, 0, 1, 0, 1, 0],
            urgent: [0, 2, 0, 1, 0, 0, 1]
        };

        expect(statisticsModel.getWeeklyTasks()).toEqual(expecedResult);
    });

    it('should return sorted tasks on getMonthlyTasks', () => {
        const expecedResult = {
            failed: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hight: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            middle: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            urgent: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

        expect(statisticsModel.getMonthlyTasks()).toEqual(expecedResult);
    });

    it('should return sorted tasks on getMonthlyPomodoros', () => {
        const expecedResult = {
            failed: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hight: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            middle: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            urgent: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

        expect(statisticsModel.getMonthlyPomodoros()).toEqual(expecedResult);
    });
});
