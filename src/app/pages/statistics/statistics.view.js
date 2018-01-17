import { PubSub } from '../../Pubsub';
import { statisticsModel } from './statistics.model';

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

/**
 * statistics view
 * @memberof module:StatisticsPage
 */
class StatisticsView {
    constructor () {
        this.navTimeVal = 'Day';

        this.navTypeVal = 'Pomodoros';

        /** default options of Charts */
        this.defaultChartoptions = {
            chart: {
                renderTo: 'Highchart',
                backgroundColor: 'transparent',
                type: 'column'
            },
            title: { text: null },
            legend: {
                enabled: false
            },
            colors: ['#F75C4C', '#FFA841', '#FDDC43', '#1ABC9C', '#9F9F9F'],
            xAxis: {
                labels: {
                    style: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                    }
                },
                tickColor: 'transparent'
            },
            yAxis: {
                title: null,
                labels: {
                    style: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            }
        };

        /** initing sort time nav */
        this.initSortByTime = initSortByTime;

        /** initing sort by type nav */
        this.initTypeGraphNav = initTypeGraphNav;
    }

    /**
   * renders page
   */
    render () {
        PubSub.publish('render/header', { statistics: 'selected' });

        const main = document.querySelector('main');
        main.innerHTML = (require('./statistics.hbs'))();
        main.className = 'reports-page';

        this.initSortByTime();
        this.initTypeGraphNav();

        this.renderReport({ time: this.navTimeVal, type: this.navTypeVal });

        $('body').tooltip();
    }


    /** renders chart */
    renderReport (options) {
        const reportData = statisticsModel.getGroupedData(options);


        switch (options.time) {
            case 'Day':
                this.renderDailyReport(reportData);
                break;
            case 'Week':
                this.renderWeeklyReport(reportData);
                break;
            case 'Month':
                this.renderMonthlyReport(reportData);
                break;
            default:
                break;
        }
    }

    /**
   * renders daily chart
   * @param {object} - data for Chart
   */
    renderDailyReport (data) {
        const options = this.defaultChartoptions;

        options.xAxis.categories = ['Urgent', 'Hight', 'Middle', 'Low', 'Failed'];

        options.series = [{
            name: this.navTypeVal,
            data: [{ y: data.urgent, color: '#F75C4C' },
                { y: data.hight, color: '#FFA841' },
                { y: data.middle, color: '#FDDC43' },
                { y: data.low, color: '#1ABC9C' },
                { y: data.failed, color: '#9F9F9F' }]
        }];

        Highcharts.chart(options);
    }


    /**
   * renders weekly chart
   * @param {object} - data for Chart
   */
    renderWeeklyReport (data) {
        const options = this.defaultChartoptions;

        options.xAxis.categories = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        options.plotOptions = {
            column: {
                stacking: 'normal'
            }
        };

        options.tooltip = {
            formatter () {
                return `<b>${this.series.name.toUpperCase()}</b><br/>${
                    this.navTypeVal}: ${this.y}<br/>`;
            }
        };

        options.series = [{
            name: 'urgent',
            data: data.urgent,
            stack: 'succeded'
        }, {
            name: 'hight',
            data: data.hight,
            stack: 'succeded'
        },
        {
            name: 'middle',
            data: data.middle,
            stack: 'succeded'
        }, {
            name: 'low',
            data: data.low,
            stack: 'succeded'
        }, {
            name: 'failed',
            data: data.failed,
            stack: 'failed'
        }];

        Highcharts.chart(options);
    }

    /**
   * renders monthly chart
   * @param {object} - data for Chart
   */
    renderMonthlyReport (data) {
        const options = this.defaultChartoptions;

        const categories = Array(...{ length: 32 }).map(Number.call, Number);

        options.xAxis.categories = categories.slice(1, categories.length);


        options.plotOptions = {
            column: {
                stacking: 'normal'
            }
        };

        options.tooltip = {
            formatter () {
                return `<b>${this.series.name.toUpperCase()}</b><br/>${
                    this.navTypeVal}: ${this.y}<br/>`;
            }
        };

        options.series = [{
            name: 'urgent',
            data: data.urgent,
            stack: 'all'
        }, {
            name: 'hight',
            data: data.hight,
            stack: 'all'
        },
        {
            name: 'middle',
            data: data.middle,
            stack: 'all'
        }, {
            name: 'low',
            data: data.low,
            stack: 'all'
        }, {
            name: 'failed',
            data: data.failed,
            stack: 'all'
        }];

        Highcharts.chart(options);
    }
}


function initSortByTime () {
    const self = this;
    const navs = document.querySelectorAll('.time-amount-nav > ul > li > a');

    $('.time-amount-nav').tabs();

    navs.forEach((nav) => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();

            self.navTimeVal = e.target.innerText;

            self.renderReport({ time: this.navTimeVal, type: this.navTypeVal });
        });
    });
}

function initTypeGraphNav () {
    const self = this;

    const navs = document.querySelectorAll('.type-graph-nav > ul > li > a');

    $('.type-graph-nav').tabs();


    navs.forEach((nav) => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();

            self.navTypeVal = e.target.innerText;

            self.renderReport({ time: self.navTimeVal, type: self.navTypeVal });
        });
    });
}

export default new StatisticsView();
