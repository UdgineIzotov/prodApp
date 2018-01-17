/**
 * @namespace Graph
 */
/**
 * Graph class
 * @memberOf Graph
 */
export default function Graph (_workingArea) {
    let workTime = 15;
    let workIteration = 4;
    let shortBreak = 4;
    let longBreak = 25;

    const workingArea = _workingArea;

    const upperScale = workingArea.getElementsByClassName('upper-scale')[0];
    const lowerScale = workingArea.getElementsByClassName('lower-scale')[0];
    const timeline = workingArea.getElementsByClassName('timeline')[0];

    const workBars = Array.from(timeline.getElementsByClassName('work-bar'));
    const shortBreakBars = Array.from(timeline.getElementsByClassName('short-break-bar'));
    const longBreakBar = timeline.getElementsByClassName('long-break-bar')[0];

    /**
     * getting the settings
     * @memberOf Graph
     */
    this.getSettings = function () {
        return {
            workTime,
            workIteration,
            shortBreak,
            longBreak
        };
    };
    /**
     * renders a graph
     * @memberOf Graph
     * @param {object} options
     */
    this.renderGraph = function (options) {
        if (options) {
            updateProps(options);
        }
        renderScales();
        renderTimeline();
    };

    /**
     * updating graph settings with given data
     * @memberOf Graph
     * @param {object} options
     */
    function updateProps (options) {
        switch (options.name) {
            case 'work-iteration':
                if (options.op === '+') {
                    workIteration += options.step;
                }
                if (options.op === '-') {
                    workIteration -= options.step;
                }
                break;
            case 'work-time':
                if (options.op === '+') {
                    workTime += options.step;
                }
                if (options.op === '-') {
                    workTime -= options.step;
                }
                break;
            case 'short-break':
                if (options.op === '+') {
                    shortBreak += options.step;
                }
                if (options.op === '-') {
                    shortBreak -= options.step;
                }
                break;
            case 'long-break':
                if (options.op === '+') {
                    longBreak += options.step;
                }
                if (options.op === '-') {
                    longBreak -= options.step;
                }
                break;
            default:
                break;
        }
    }

    /**
     * render scales on graph
     * memgerOf Graph
     */
    function renderScales () {
        const totalTime = countTotalTime();
        const endTimeDiv = upperScale.getElementsByClassName('end')[0];

        const oneInerationTime = (workTime * workIteration) + (shortBreak * (workIteration - 1)) + longBreak;
        const oneIterationDiv = upperScale.getElementsByClassName('one-iteration-time')[0];

        const scaleGap = (30 / totalTime) * 100;
        lowerScale.innerHTML = '';

        endTimeDiv.innerText = parceTime(totalTime);

        oneIterationDiv.innerText = `First cycle: ${parceTime(oneInerationTime)}`;
        oneIterationDiv.style.left = `${(oneInerationTime / totalTime) * 100}%`;

        let i = 1;
        while (i * 30 < totalTime) {
            const scaleDiv = document.createElement('div');
            scaleDiv.classList = 'scale-point';
            scaleDiv.innerText = parceTime(30 * i);
            scaleDiv.style.left = `${scaleGap * i}%`;

            lowerScale.appendChild(scaleDiv);
            i++;
        }
    }

    /**
     * render timelines on graph
     * @memberOf Graph
     */
    function renderTimeline () {
        countWidthPercentages();

        workBars.forEach((elem, index) => {
            elem.style.display = 'inline-block';

            if (index > workIteration - 1 && index < workBars.length / 2) {
                elem.style.display = 'none';
            }
            if (index > (workBars.length / 2) + workIteration - 1 &&
          index < workBars.length) {
                elem.style.display = 'none';
            }
        });

        shortBreakBars.forEach((elem, index) => {
            elem.style.display = 'inline-block';

            if ((index > workIteration - 2 && index < shortBreakBars.length / 2)
            ) {
                elem.style.display = 'none';
            }
            if (index > (workBars.length / 2) + (workIteration - 3) &&
          index < shortBreakBars.length) {
                elem.style.display = 'none';
            }
        });
    }

    /**
     * counts total time of graph timeline
     * @memberOf Graph
     */
    function countTotalTime () {
        return 2 * (workTime * workIteration) +
        2 * (shortBreak * (workIteration - 1)) +
        longBreak;
    }
    /**
     * parses time to proper look
     * @param {number} time
     */
    function parceTime (time) {
        const hours = Math.floor(time / 60) || '';
        const minutes = time % 60 || '';

        if (!hours) {
            return `${minutes}m`;
        }

        if (!minutes) {
            return `${hours}h`;
        }

        return `${hours}h ${minutes}m`;
    }

    /**
     * counts time to percents
     * @memberOf Graph
     */
    function countWidthPercentages () {
        const totalTime = countTotalTime();

        const workIterationWidth = `${(workTime / totalTime) * 100}%`;
        const shortBreakWidth = `${(shortBreak / totalTime) * 100}%`;
        const longBreakWidt = `${(longBreak / totalTime) * 100}%`;

        workBars.forEach(elem => elem.style.width = workIterationWidth);
        shortBreakBars.forEach(elem => elem.style.width = shortBreakWidth);
        longBreakBar.style.width = longBreakWidt;
    }
}

