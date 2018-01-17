import { fireDataBase } from '../../model/objectDAO';
/**
 * timer model
 * @memberof module:TimerPage
 */
class TimerModelCreator {
    constructor () {
        this.currentTask = {};

        this.settings = null;
    }

    /**
     * calculater if it is long break or not
     * @returns {bool} - true on Long Break
     */
    isLongBreak () {
        const iterationsCount = parseInt(sessionStorage.getItem('pomodoroIterations'), 10) || 1;


        if (iterationsCount % this.getIterationsCount() === 0) {
            return true;
        }

        return false;
    }

    /**
     * increases pomodoro iterations
     */
    incPomodoroIterations () {
        let iterationsCount = sessionStorage.getItem('pomodoroIterations') || 0;

        iterationsCount++;

        sessionStorage.setItem('pomodoroIterations', iterationsCount);
    }
    /**
     * gets work time from settings
     * @returns {string} - work time
     */
    getWorkingTime () {
        if (!this.settings) {
            this.settings = JSON.parse(sessionStorage.getItem('settings'));
        }
        /*istanbul ignore next:simple getter*/
        return this.settings.workTime;
    }

    /**
     * gets shot break time from settings
     * @returns {string} - shot break time
     */
    getShortBreaktime () {
        if (!this.settings) {
            this.settings = JSON.parse(sessionStorage.getItem('settings'));
        }
      /*istanbul ignore next:simple getter*/
      return this.settings.shortBreak;
    }

    /**
     * gets long break time from settings
     * @returns {string} - long break time
     */
    getLongBreak () {
        if (!this.settings) {
            this.settings = JSON.parse(sessionStorage.getItem('settings'));
        }
        /*istanbul ignore next:simple getter*/
        return this.settings.longBreak;
    }
    /**
     * gets iterations count time from settings
     * @returns {string} - iterations count
     */
    getIterationsCount () {
        if (!this.settings) {
            this.settings = JSON.parse(sessionStorage.getItem('settings'));
        }
        /*istanbul ignore next:simple getter*/
        return this.settings.workIteration;
    }

    /**
     * gets task by specific id
     * @param {string} id
     * @returns {object} - task
     */
    getTask (id) {
        return fireDataBase.getTask(id).then((data) => {
            TimerModel.currentTask = data.val();
            return data.val();
        });
    }

     /** set one failed pomodoro to task locally and to firebase */
    failPomodoro () {
        this.currentTask.estimationFailed++;

        fireDataBase.setTask(this.currentTask.id, this.currentTask);
    }

     /** set one succed pomodoro to task locally and to firebase */
    succeedPomodoro () {
        this.currentTask.estimationSucced++;

        fireDataBase.setTask(this.currentTask.id, this.currentTask);
    }
     /** set done task locally and to firebase */
    doneTask () {
        this.currentTask.isDone = true;
        fireDataBase.setTask(this.currentTask.id, this.currentTask);
    }

     /**
      * calculates if tasks is done
      * @returns {bool} - true if tasks id done
      */
    isTaskDone () {
        return this.currentTask.estimationTotal <=
          this.currentTask.estimationFailed + this.currentTask.estimationSucced;
    }
    /**
      * calculates if tasks is failed
      * @returns {bool} - true if tasks id failed
      */
    isFailed () {
        return this.isTaskDone() && (this.currentTask.estimationFailed > this.currentTask.estimationSucced);
    }
    /**
      * calculates if tasks is succed
      * @returns {bool} - true if tasks id done
      */
    isSucced () {
        return this.isTaskDone() && (this.currentTask.estimationFailed <= this.currentTask.estimationSucced);
    }

    addEstimation () {
      if (this.currentTask.estimationTotal >= 5) {
        return;
      }

      this.currentTask.estimationTotal++;

      fireDataBase.setTask(this.currentTask.id, this.currentTask);

    }
}

export const TimerModel = new TimerModelCreator();
