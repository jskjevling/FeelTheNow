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
};

var addIP = function addIP(ip) {
    ipaddress.push(ip);
};

findIP(addIP);

/* The main module class definition */
var Main = React.createClass({
    handleDataSubmit: function(dataObject){
        console.log(dataObject);
        var tempObj = {
            age: dataObject.userAge,
            gender: dataObject.userGender,
            email: dataObject.userEmail
        };
        this.setState(tempObj);
        localStorage.setItem('ionsAppState', JSON.stringify(tempObj));
    },
    getInitialState: function () {
        var tempState = JSON.parse(localStorage.getItem('ionsAppState'));
        console.log(tempState);
        return {
            ip: ipaddress,
            age: (tempState) ? tempState['age'] : null,
            gender: (tempState) ? tempState['gender'] : null,
            email: (tempState) ? tempState['email'] : null,
            videoID: null,
            videoLive: null,
            liveResponseBox: null,
            response: null,
            feedback: null
        };
    },
    render: function(){
        return (
            <div className="container">
                <Header/>
                {React.cloneElement(this.props.children, {onDataSubmit: this.handleDataSubmit})}
                <Footer/>
            </div>
        );
    }
});

module.exports = Main;
