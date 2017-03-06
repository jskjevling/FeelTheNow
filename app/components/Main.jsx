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
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log('The passed dataObject:\n');
        console.log(dataObject);
        console.log('The retreived state from localStorage:\n');
        console.log(tempState);
        var tempObj = {
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
        console.log('And here is the tempObj after modification:\n');
        console.log(tempObj);
        this.setState(tempObj);
        localStorage.setItem('ionsAppState', JSON.stringify(tempObj));
    },
    getInitialState: function () {
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log(tempState);
        return {
            ip: typeof tempState.ip !== undefined ? tempState.ip : ipaddress,
            age: typeof tempState.age !== undefined ? tempState.age : 'undefined',
            gender: typeof tempState.gender !== undefined ? tempState.gender : 'undefined',
            email: typeof tempState.email !== undefined ? tempState.email : 'undefined',
            doesAgree: typeof tempState.doesAgree !== undefined ? tempState.doesAgree : 'undefined',
            video: typeof tempState.video !== undefined ? tempState.video : 'undefined',
            videoID: typeof tempState.videoID !== undefined ? tempState.videoID : 0,
            videoLive: typeof tempState.videoLive !== undefined ? tempState.videoLive : 'undefined',
            position: typeof tempState.position !== undefined ? tempState.position : 'undefined',
            viewers: typeof tempState.viewers !== undefined ? tempState.viewers : 'undefined',
            liveResponseBox: typeof tempState.liveResponseBox !== undefined ? tempState.liveResponseBox : 'undefined',
            response: typeof tempState.response !== undefined ? tempState.response : 'undefined',
            feedback: typeof tempState.feedback !== undefined ? tempState.feedback : 'undefined',
            headerOn: true,
            footerOn: true
        };
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
