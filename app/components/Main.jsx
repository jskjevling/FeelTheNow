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
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log(dataObject);
        var tempObj = {
            ip: ipaddress ? ipaddress : tempState['ip'],
            age: dataObject.userAge ? dataObject.userAge : tempState['age'],
            gender: dataObject.userGender ? dataObject.userGender : tempState['gender'],
            email: dataObject.userEmail ? dataObject.userEmail : tempState['email'],
            video: dataObject.video ? dataObject.video : tempState['video'],
            videoID: dataObject.videoID ? dataObject.videoID : tempState['videoID'],
            videoLive: dataObject.videoLive ? dataObject.videoLive : tempState['videoLive'],
            liveResponseBox: dataObject.liveResponseBox ? dataObject.liveResponseBox : tempState['liveResponseBox'],
            response: dataObject.response ? dataObject.response : tempState['response'],
            feedback: dataObject.feedback ? dataObject.feedback : tempState['feedback'],
            headerOn: dataObject.headerOn,
            footerOn: dataObject.footerOn
        };
        this.setState(tempObj);
        localStorage.setItem('ionsAppState', JSON.stringify(tempObj));
    },
    getInitialState: function () {
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log(tempState);
        return {
            ip: ipaddress,
            age: tempState ? tempState['age'] : 'undefined',
            gender: tempState ? tempState['gender'] : 'undefined',
            email: tempState ? tempState['email'] : 'undefined',
            videoID: 0,
            videoLive: 'undefined',
            liveResponseBox: 'undefined',
            response: 'undefined',
            feedback: 'undefined',
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
