var React = require('react');

var FinalPage = React.createClass({
    render: function () {
        return (
            <div className="thanks">
                <div className="row">
                    <h1 className="small-12 column text-center">Thank you for particiapting in this experiment.</h1>
                </div>
                <div className="row pad-sides">
                    <h2 className="small-12 column text-center">Results about the experiment will be posted on the IONS website within the coming months.</h2>
                </div>
                <div className="row pad-sides">
                    <h3 className="small-12 column text-center pad-40">Special thanks to <a href="http://skjevling.com" target="_blank">Jeremy Skjevling</a> for his help in programming this experiment.</h3>
                </div>
            </div>
        );
    }
});

module.exports = FinalPage;
