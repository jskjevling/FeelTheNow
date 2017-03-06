var React = require('react'),
    Header = require('Header'),
    Footer = require('Footer');

/* TODO: Implement file save on final survey submit. */

/*
 * We need a method for returning the client IP via javascript.  The below code
 * does exactly that.  It will return an array (recursively pushing new IPs to it)
 * if multiple IPs are related to the client, but we only take the first element in the array.
 */
var ipaddress = [];

var findIP = function findIP(onNewIP) {
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
    if (myPeerConnection) {
        var pc = new myPeerConnection({iceServers: []}),
            noop = function() {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function ipIterate(ip) {
            if (!localIPs[ip]) {
                onNewIP(ip);
            }
            localIPs[ip] = true;
        }
        /* Create a bogus data channel */
        pc.createDataChannel("");
        pc.createOffer(function(sdp) {
            sdp.sdp.split('\n').forEach(function(line) {
                if (line.indexOf('candidate') < 0) {
                    return;
                }
                line.match(ipRegex).forEach(ipIterate);
            });
            pc.setLocalDescription(sdp, noop, noop);
        }, noop); // create offer and set local description
        pc.onicecandidate = function(ice) { //listen for candidate events
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
                return;
            }
            ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
        };
    }
};

var addIP = function addIP(ip) {
    ipaddress.push(ip);
};

findIP(addIP);

/* The main module class definition */
var Main = React.createClass({
    handleDataSubmit: function(dataObject){
        //retrieve the app state from localStorage
        var tempState = JSON.parse(localStorage.getItem('ionsAppState')),
            tempObj;
        console.log('The passed dataObject:\n');
        console.log(dataObject);
        console.log('The retreived state from localStorage:\n');
        console.log(tempState);
        if (tempState) {
            tempObj = {
                ip: ipaddress ? ipaddress : tempState['ip'],
                age: dataObject.age ? dataObject.age : tempState['age'],
                gender: dataObject.gender ? dataObject.gender : tempState['gender'],
                email: dataObject.email ? dataObject.email : tempState['email'],
                doesAgree: dataObject.doesAgree ? dataObject.doesAgree : tempState['doesAgree'],
                video: dataObject.video ? dataObject.video : tempState['video'],
                videoID: dataObject.videoID ? dataObject.videoID : tempState['videoID'],
                videoLive: dataObject.videoLive ? dataObject.videoLive : tempState['videoLive'],
                position: dataObject.position ? dataObject.position : tempState['position'],
                viewers: dataObject.viewers ? dataObject.viewers : tempState['viewers'],
                liveResponseBox: dataObject.liveResponseBox ? dataObject.liveResponseBox : tempState['liveResponseBox'],
                response: dataObject.response ? dataObject.response : tempState['response'],
                feedback: dataObject.feedback ? dataObject.feedback : tempState['feedback'],
                headerOn: dataObject.headerOn,
                footerOn: dataObject.footerOn
            };
        } else {
            tempObj = {
                ip: ipaddress,
                age: dataObject.age ? dataObject.age : 'undefined',
                gender: dataObject.gender ? dataObject.gender : 'undefined',
                email: dataObject.email ? dataObject.email : 'undefined',
                doesAgree: dataObject.doesAgree ? dataObject.doesAgree : false,
                video: dataObject.video ? dataObject.video : 'undefined',
                videoID: dataObject.videoID ? dataObject.videoID : 'undefined',
                videoLive: dataObject.videoLive ? dataObject.videoLive : 'undefined',
                position: dataObject.position ? dataObject.position : 'undefined',
                viewers: dataObject.viewers ? dataObject.viewers : 'undefined',
                liveResponseBox: dataObject.liveResponseBox ? dataObject.liveResponseBox : 'undefined',
                response: dataObject.response ? dataObject.response : 'undefined',
                feedback: dataObject.feedback ? dataObject.feedback : 'undefined',
                headerOn: dataObject.headerOn,
                footerOn: dataObject.footerOn
            };
        }
        console.log('And here is the tempObj after modification:\n');
        console.log(tempObj);
        this.setState(tempObj);
        localStorage.setItem('ionsAppState', JSON.stringify(tempObj));
    },
    getInitialState: function () {
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log(tempState);
        if (tempState) {
            return {
                ip: tempState.ip ? tempState.ip : ipaddress,
                age: tempState.age ? tempState.age : 'undefined',
                gender: tempState.gender ? tempState.gender : 'undefined',
                email: tempState.email ? tempState.email : 'undefined',
                doesAgree: tempState.doesAgree ? tempState.doesAgree : 'undefined',
                video: tempState.video ? tempState.video : 'undefined',
                videoID: tempState.videoID ? tempState.videoID : 0,
                videoLive: tempState.videoLive ? tempState.videoLive : 'undefined',
                position: tempState.position ? tempState.position : 'undefined',
                viewers: tempState.viewers ? tempState.viewers : 'undefined',
                liveResponseBox: tempState.liveResponseBox ? tempState.liveResponseBox : 'undefined',
                response: tempState.response ? tempState.response : 'undefined',
                feedback: tempState.feedback ? tempState.feedback : 'undefined',
                headerOn: true,
                footerOn: true
            };
        } else {
            return {
                ip: ipaddress,
                age: 'undefined',
                gender: 'undefined',
                email: 'undefined',
                doesAgree: 'undefined',
                video: 'undefined',
                videoID: 0,
                videoLive: 'undefined',
                position: 'undefined',
                viewers: 'undefined',
                liveResponseBox: 'undefined',
                response: 'undefined',
                feedback: 'undefined',
                headerOn: true,
                footerOn: true
            };
        }
    },
    render: function(){
        var {headerOn, footerOn} = this.state;
        function renderHeader() {
            if (headerOn) {
                return (<Header/>);
            }
        }
        function renderFooter(){
            if (footerOn) {
                return (<Footer/>);
            }
        }
        return (
            <div className="container">
                {renderHeader()}
                <div className="row">
                    {React.cloneElement(this.props.children, {onDataSubmit: this.handleDataSubmit})}
                </div>
                {renderFooter()}
            </div>
        );
    }
});

module.exports = Main;
