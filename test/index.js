const tests = require.context('../src/app/', true, /\.spec\.js$/);

tests.keys().forEach(tests);

const pagesModels = require.context('../src/app/pages/', true, /\.model\.js$/);

pagesModels.keys().forEach(pagesModels);

const pagesCtrls = require.context('../src/app/pages/', true, /\.ctrl\.js$/);

pagesCtrls.keys().forEach(pagesCtrls);

const model = require.context('../src/app/model/', true, /\.js$/);

model.keys().forEach(model);

const router = require.context('../src/app/', true, /router\.js$/ );

router.keys().forEach(router);



//const pagesControllers = require.context('../src/app/pages/', true, /controller/ );

//console.dir(pagesControllers.keys());

//pagesControllers.keys().forEach(pagesControllers);

