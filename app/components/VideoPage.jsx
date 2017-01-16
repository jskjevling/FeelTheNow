/* Required modules */
var React = require('react'),
    ButtonObject = require('ButtonObject'),
    ContentBlock = require('ContentBlock'),
    {hashHistory} = require('react-router');

/*
 * Method to run when selection is made, we set state here and push the next route
 * TODO: Implement set state up to Main component to capture video data
 */
var record = function record(e){
    e.preventDefault();
    var userChoice = e.target.id;
    switch (userChoice) {
    case 'live-right':
    case 'live-left':
        console.log('user chose live');
        break;
    case 'replay-left':
    case 'replay-right':
        console.log('user chose replay');
        break;
    }
    hashHistory.push('/survey');
};

/*
 * Method that sets up video for the timed response.  This is called by the
 * Start button in the overlay.
 */

 var start = function start(e){
     e.preventDefault();
     if (counter > 0) {
         desc.style.color = 'red';
         return;
     } else {
         coverUp.addEventListener('trainsitionend', function(){
             coverUp.style.display = 'none';
         });
         desc.style.color = '';
         desc.style.paddingBottom = '';
         coverUp.style.opacity = '0';
         player.setMuted(false);
         if (POSITION === 0) {
             liveLeft.style.display = 'flex';
         } else {
             liveRight.style.display = 'flex';
         }
         startCountdown();
     }
 };

/* Expose an options object for the Twitch code to store variables */
var savedOptions = {
    position: null,
    video: null,
    videoLive: null,
    viewers: null
};

/* Small method for determining random number with even distribution */
var pickRandom = function pickRandom(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Instantiate the needed parameters */
var player;
const PLAYER_WIDTH = 854;
const PLAYER_HEIGHT = 480;
const IS_MUTED = true;
/* Random number selection to pick live or recorded video */
const CHOICE = pickRandom(0,1);
/* The position of the response buttions (left or right) */
const POSITION = pickRandom(0,1);
const VIDEO_IS_LIVE = CHOICE ? false : true;
const LIMIT = '10';
const CLIENT_ID = 't9x3a5u7t0l09909hpc5rlnn0z08ar6';
const QUERY = 'creative';
var desc,
    liveLeft,
    liveRight,
    coverUp,
    counter = 35,
    countInterval;

var saveOptions = function saveOptions(video, position, isLive, viewers){
    savedOptions.video = video;
    savedOptions.position = position;
    savedOptions.videoLive = isLive;
    savedOptions.viewers = viewers;
};

var startLoadCounter = function startLoadCounter(){
    countInterval = setInterval(function(){
        if (counter > 0) {
            counter--;
        } else {
            clearInterval(countInterval);
            desc.style.color = 'green';
            desc.innerHTML = 'OK, ready to go!';
            return;
        }
        desc.innerHTML = `Please wait while the video loads. ${counter} seconds remaining.`;
    }, 1000);
};

var startCountdown = function startCountdown(){
    counter = 10;
    countInterval = setInterval(function(){
        if (counter > 0) {
            counter--;
        } else {
            clearInterval(countInterval);
            coverUp.style.display = 'block';
            coverUp.style.opacity = '1';
            coverUp.innerHTML = '<h1>Time\'s up!</h1><p>Sorry, but you did not select a response in time.</p>';
            liveLeft.style.display = 'none';
            liveRight.style.display = 'none';
            player.setMuted(true);
            desc.style.paddingBottom = '40px';
        }
        desc.innerHTML = `Please choose one. ${counter} seconds remaining.`;
    }, 1000);
};

/*
 * Method for loading the recorded video, chosen at random. It returns the result
 * for the AJAX call so that it may be chained if needed.
 */
var loadRecorded = function loadRecorded() {
    return $.ajax({
        type: 'GET',
        url: `https://api.twitch.tv/kraken/videos/top?LIMIT=${LIMIT}&client_id=${CLIENT_ID}&query=${QUERY}`,
        success: function(json) {
            /* Choose a video from the returned array */
            const result = json.videos[pickRandom(0,9)];
            /* Set up the options for instantiating the player */
            const options = {
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                controls: false,
                muted: IS_MUTED,
                video: result._id
            };
            /* Save the various options for later use */
            saveOptions(result._id, POSITION, VIDEO_IS_LIVE, 0);
            /* Instantiate the player */
            player = new Twitch.Player('player_div', options);
            player.setVolume(0.5);
            /* We set the desc field to advise the user of potential wait times */
            desc.innerHTML = 'Please wait while the video loads.';
            startLoadCounter();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(`it failed. status is ${textStatus} and the error thrown was ${errorThrown} and the jqXHR is ${JSON.stringify(jqXHR)}`);
        }
    });
};

/*
 * When selecting a live stream, we want to make sure we have the most viewers
 * possible, so we need to make two queries.  First we get the list of top games
 * by number of viewers. This method handles that call.
 */

var getGames = function getGames() {
    return $.ajax({
        type: 'GET',
        url: `https://api.twitch.tv/kraken/games/top?LIMIT=${LIMIT}&client_id=${CLIENT_ID}`,
        success: function(json) {
            /* We grab the first result from the response, since it will be the best */
            const result = json.top[0];
            /* We then save the game name for the next step, when we search the streams */
            savedOptions.video = result.game.name;
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(`it failed. status is ${textStatus} and the error thrown was ${errorThrown} and the jqXHR is ${JSON.stringify(jqXHR)}`);
        }
    });
};

/*
 * Once we have the name of the game with the most viewers, we can select a channel
 * based on this information. This method is chained from the getGames method above
 * since that step needs to be complete before we can determine the channel to load.
 */
var loadLive = function loadLive() {
    $.ajax({
        type: 'GET',
        url: `https://api.twitch.tv/kraken/streams?game=${savedOptions.video}&LIMIT=${LIMIT}&client_id=${CLIENT_ID}`,
        success: function(json) {
            /*
             * We pick the top stream in the list since they should be ordered by
             * popularity.  This should mean we have the highest number of viewers
             * possible
             */
            const result = json.streams[0];
            /* Set the player options */
            const options = {
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                channel: result.channel.name,
                controls: false,
                muted: IS_MUTED
            };
            saveOptions(result._id, POSITION, VIDEO_IS_LIVE, result.viewers);
            /* Instantiate the player */
            player = new Twitch.Player('player_div', options);
            player.setVolume(0.5);
            /* We set the desc field to advise the user of potential wait times */
            desc.innerHTML = 'Please wait while the video loads.';
            startLoadCounter();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(`it failed. status is ${textStatus} and the error thrown was ${errorThrown} and the jqXHR is ${JSON.stringify(jqXHR)}`);
        }
    });
};

/*
 * This small method runs once the component is mounted, and it loads a recorded
 * video or a live stream depending on the random number generated.
 */
var loadRoutine = function loadRoutine(){
    if (CHOICE) {
        loadRecorded();
    } else {
        getGames().then(loadLive);
    }
};

/* The main component class */
var VideoPage = React.createClass({
    componentDidMount: function() {
        desc = document.querySelector('#counter');
        desc.style.paddingBottom = '40px';
        coverUp = document.querySelector('#player_cover');
        liveLeft = document.querySelector('.live-left');
        liveRight = document.querySelector('.live-right');
        loadRoutine();
    },
    render: function () {
        return (
            <div>
                <h1>Is this video stream live or recorded?</h1>
                <section className="video">
                    <div className="centered-player" id="player_div"></div>
                    <div className="video-block blue large" id="player_cover">
                        <h2>Procedure</h2>
                        <p>You will be shown a video that is either a live video or a pre-recorded video. Based on your intuition you will indicate if you feel that the video is live or not. The idea is that live video is being viewed by thousands to millions of people, whereas recorded video is only being viewed by you. Can you feel a difference? Does one video feel more alive to you than the other? You will have 10 seconds to answer.</p>
                        <form onSubmit={start}>
                            <ButtonObject label="Start"/>
                        </form>
                    </div>
                    <p className="video-description countdown" id="counter"></p>
                    <div className="live-left">
                        <form onSubmit={record} id="live-left">
                            <ButtonObject label="I think it is live"/>
                        </form>
                        <form onSubmit={record} id="replay-right">
                            <ButtonObject label="I think it is a replay"/>
                        </form>
                    </div>
                    <div className="live-right">
                        <form onSubmit={record} id="replay-left">
                            <ButtonObject label="I think it is a replay"/>
                        </form>
                        <form onSubmit={record} id="live-right">
                            <ButtonObject name="live-right" label="I think it is live"/>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
});

module.exports = VideoPage;
