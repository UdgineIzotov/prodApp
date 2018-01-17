import { TimerController } from './timer.ctrl';

describe('timer controller tests', () => {
    const timerMock = {
        failPomodoro: () => {},
        succeedPomodoro: () => {},
        incPomodoroIterations: () => {}
    };


    beforeEach(() => {
        TimerController.model = timerMock;
    });

    it('should call model method on failPomodoro', () => {
        spyOn(timerMock, 'failPomodoro');

        TimerController.failPomodoro();

        expect(timerMock.failPomodoro).toHaveBeenCalled();
    });

    it('should call model method on succeedPomodoro', () => {
        spyOn(timerMock, 'succeedPomodoro');

        TimerController.succeedPomodoro();

        expect(timerMock.succeedPomodoro).toHaveBeenCalled();
    });

    it('should call model method on incPomodoroIterations', () => {
        spyOn(timerMock, 'incPomodoroIterations');

        TimerController.incIterations();

        expect(timerMock.incPomodoroIterations).toHaveBeenCalled();
    });
});
