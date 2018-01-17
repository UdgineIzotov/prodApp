import { TimerModel } from './timer.model';
/**
 * @module TimerPage
 */
/** timer controller  */
class TimerControllerCreator {
    constructor (timerModel) {
        this.model = timerModel;
    }

    /** set one failed pomodoro to task */
    failPomodoro () {
        this.model.failPomodoro();
    }

    /** set one succed pomodoro to task  */
    succeedPomodoro () {
        this.model.succeedPomodoro();
    }

    /** increases iteration count */
    incIterations () {
        this.model.incPomodoroIterations();
    }
}

export const TimerController = new TimerControllerCreator(TimerModel);

