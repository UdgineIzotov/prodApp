import { PubSub } from '../../Pubsub';
import { TimerModel } from './timer.model';
import { Router } from '../../router';
import { TimerController } from './timer.ctrl';
/**
 * timer view
 * @class
 * @memberof module:TimerPage
 */
class TimerView {
    constructor () {
    /** timer state */
        this.state = {
            condition: 'work', // 'break'
            pomodoroState: ''
        };
    }

    /**
   * renders page
   * @memberof TimerView
   * @param {string} taskId
   */
    render (taskId) {
        const self = this;
        self.state = {
            condition: 'work', // 'break' 'breakEnded'
            processing: false
        };
        PubSub.publish('render/header', { statistics: 'selected' });

        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.classList.add('timer-page');

        TimerModel.getTask(taskId).then((task) => {
            const main = document.querySelector('main');
            container.innerHTML = (require('./timer.hbs'))({ task });

            this.renderEstimation(
                container.querySelector('.estimation-container'),
                {
                    succed: task.estimationSucced,
                    failed: task.estimationFailed,
                    total: task.estimationTotal
                }
            );

            fragment.appendChild(container);
            main.innerHTML = '';
            main.appendChild(fragment);
            $(main).tooltip();


            this.initAddPomodoro();

            this.proccessTimerState({ condition: 'work' });
        });
    }

    /**
   * renders estimation for task
   * @param {DomNode} container - where render
   * @param {object} estimationData - {succed, failed, total}
   */
    renderEstimation (container, estimationData) {
        let estimationHtml = '';

        if (estimationData.succed + estimationData.failed > estimationData.total) {
            throw new Error('Estimation values error');
        }

        for (let i = 0; i < estimationData.succed; i++) {
            estimationHtml += '<span class="tomato fill"></span>';
        }
        for (let i = 0; i < estimationData.failed; i++) {
            estimationHtml += '<span class="tomato fail"></span>';
        }
        for (let i = estimationData.succed + estimationData.failed; i < estimationData.total; i++) {
            estimationHtml += '<span class="tomato"></span>';
        }

        container.innerHTML = estimationHtml;
    }

    /**
   * processes timer state
   * @param {object} state - state of the timer
   */
    proccessTimerState (state) {
        const self = this;
        const btnsContainer = document.querySelector('.timer-control-btns');

        switch (state.condition) {
            case 'work':
                btnsContainer.innerHTML = '';

                self.resetTimerProgress();

                const btnNode = createBtn('start', 'Start');

                btnNode.addEventListener('click', () => {
                    state.condition = 'work-processing';

                    setTimerDucation(TimerModel.getWorkingTime() * 60);
                    self.proccessTimerState(state);
                });

                btnsContainer.appendChild(btnNode);

                document.querySelector('.radial-timer-face .radial-timer-message').innerHTML = 'Let\'s do it!';
                break;
            case 'work-processing':
                btnsContainer.innerHTML = '';

                const failBtn = createBtn('fail-pomodora', 'Fail Pomodoro');
                const finishBtn = createBtn('finish-pomodora', 'Finish Pomodoro');


                const workAnimation = self.handleAnimationend(
                    document.querySelector('.radial-timer-half .after'),
                    () => {
                        state.condition = 'break';

                        TimerController.incIterations();
                        TimerController.succeedPomodoro();

                        const task = TimerModel.currentTask;

                        self.renderEstimation(
                            document.querySelector('.estimation-container'),
                            {
                                succed: task.estimationSucced,
                                failed: task.estimationFailed,
                                total: task.estimationTotal
                            }
                        );

                        self.proccessTimerState(state);
                    }
                );

                failBtn.addEventListener('click', () => {
                    workAnimation();
                    state.condition = 'break';

                    TimerController.incIterations();
                    TimerController.failPomodoro();

                    const task = TimerModel.currentTask;

                    self.renderEstimation(
                        document.querySelector('.estimation-container'),
                        {
                            succed: task.estimationSucced,
                            failed: task.estimationFailed,
                            total: task.estimationTotal
                        }
                    );

                    self.proccessTimerState(state);
                });

                finishBtn.addEventListener('click', () => {
                    workAnimation();
                    state.condition = 'break';

                    TimerController.incIterations();
                    TimerController.succeedPomodoro();

                    const task = TimerModel.currentTask;

                    self.renderEstimation(
                        document.querySelector('.estimation-container'),
                        {
                            succed: task.estimationSucced,
                            failed: task.estimationFailed,
                            total: task.estimationTotal
                        }
                    );

                    self.proccessTimerState(state);
                });


                btnsContainer.appendChild(failBtn);
                btnsContainer.appendChild(finishBtn);

                document.querySelector('.radial-timer-face .radial-timer-message')
                    .innerHTML = `<span class="time">${TimerModel.getWorkingTime()}</span><br>min`;

                self.startTimerProgress();
                break;
            case 'break':
                btnsContainer.innerHTML = '';

                if (TimerModel.isTaskDone()) {
                    self.resetTimerProgress();

                    document.querySelector('.radial-timer-face .radial-timer-message')
                        .innerHTML = 'You<br>Completed<br>Task';

                    TimerModel.doneTask();

                    break;
                }

                document.querySelector('.radial-timer-face .radial-timer-message')
                    .innerHTML = `break<br><span class="time">${TimerModel.getShortBreaktime()}</span><br>min`;

                const startPomodoroBtn = createBtn('start', 'Start Pomodora');
                const finishTaskBtn = createBtn('finish-task', 'Finish task');

                const breakAnimation = self.handleAnimationend(
                    document.querySelector('.radial-timer-half .after'),
                    () => {
                        document.querySelector('.radial-timer-face .radial-timer-message')
                            .innerHTML = 'Break<br>is over';
                    }
                );

                startPomodoroBtn.addEventListener('click', () => {
                    breakAnimation();
                    state.condition = 'work';

                    self.proccessTimerState(state);
                });

                finishTaskBtn.addEventListener('click', () => {
                    breakAnimation();
                    Router.navigate('task-list');
                });

                btnsContainer.appendChild(startPomodoroBtn);
                btnsContainer.appendChild(finishTaskBtn);


                if (TimerModel.isLongBreak()) {
                    const longBreak = TimerModel.getLongBreak();
                    setTimerDucation(longBreak * 60);

                    document.querySelector('.radial-timer-face .radial-timer-message')
                        .innerHTML = `break<br><span class="time">${longBreak}</span><br>min`;
                } else {
                    const shortBreak = TimerModel.getShortBreaktime();

                    setTimerDucation(shortBreak * 60);

                    document.querySelector('.radial-timer-face .radial-timer-message')
                        .innerHTML = `break<br><span class="time">${shortBreak}</span><br>min`;
                }


                self.resetTimerProgress();
                self.startTimerProgress();
                break;
            default:
                break;
        }
    }

    /**
   * handles animation end
   * @param {DomNode} node - node with animation
   * @param {Function} callback - calls on animation end
   */
    handleAnimationend (node, callback) {
        const handler = () => {
            callback();
            node.removeEventListener('animationend', handler);
        };

        node.addEventListener('animationend', handler);

        return () => node.removeEventListener('animationend', handler);
    }

    /** starts timer */
    startTimerProgress () {
        document.querySelector('.radial-timer').classList.add('play');
    }

    /** stops timer */
    stopTimerProgress () {
        document.querySelector('.radial-timer').classList.remove('play');
    }

    /** resets timer */
    resetTimerProgress () {
        this.stopTimerProgress();

        const timer = document.querySelector('.radial-timer');

        timer.classList.remove('s-animate');

        void timer.offsetWidth;

        timer.classList.add('s-animate');
    }

    initAddPomodoro () {
        const self = this;
        const addEstimationBtn = document.querySelector('.tomatoes .add-tomato');

        addEstimationBtn.addEventListener('click', (e) => {
            e.preventDefault();

            TimerModel.addEstimation();

            const task = TimerModel.currentTask;

            self.renderEstimation(
                document.querySelector('.estimation-container'),
                {
                    succed: task.estimationSucced,
                    failed: task.estimationFailed,
                    total: task.estimationTotal
                }
            );
        });
    }
}


function setTimerDucation (time) {
    document.querySelector('.radial-timer-half:nth-of-type(1) .after').style.animationDuration = `${time}s`;
    document.querySelector('.radial-timer-half:nth-of-type(2) .after').style.animationDuration = `${time}s`;
}

function createBtn (className, text) {
    const btnNode = document.createElement('button');
    btnNode.classList.add(className);
    btnNode.innerText = text;

    return btnNode;
}

export default new TimerView();
