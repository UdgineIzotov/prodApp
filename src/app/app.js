/* root component starts here */
require('assets/less/main.less'); // include general styles

import { SettingsModel } from './pages/settings/settings.model';
import { Handlebars } from './hadlebars-helpers';
// require('./router'); // include router
import { Router } from './router';
import { routingData } from './route-data';
import { defaultRoute } from './route-data';

import * as tabs from './JQueryPlugins/tabs'
import * as tooltip from './JQueryPlugins/tooltip'

Router.init(routingData);
Router.defaultRoute = defaultRoute;
Router.listen();
Router.navigate();


/* example of including header component */
require('./components/header/header');

import { DataStorage } from './model/taskDB';


import { taskListController } from './pages/tasks-list/taskList.controller';

