/* Required modules for main app component */
var React = require('react'),
    ReactDOM = require('react-dom'),
    {Route, Router, IndexRoute, hashHistory} = require('react-router'),
    Main = require('Main'),
    HomePage = require('HomePage'),
    VideoPage = require('VideoPage'),
    SurveyPage = require('SurveyPage'),
    FinalPage = require('FinalPage');

/* Render the app and set the routes */
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <Route path="video" component={VideoPage}/>
            <Route path="survey" component={SurveyPage}/>
            <Route path="thankyou" component={FinalPage}/>
            <IndexRoute component={HomePage}/>
        </Route>
    </Router>,
    document.getElementById('app')
);
