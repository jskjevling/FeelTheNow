var React = require('react');

var FinalPage = React.createClass({
    render: function () {
        return (
            <div className="thanks">
                <div className="row">
                    <h1>Thank you for particiapting in this experiment.</h1>
                </div>
                <div className="row">
                    <h2>Results about the experiment will be posted on the IONS website within the coming months.</h2>
                </div>
                <div className="row">
                    <h3>Special thanks to Jeremy Skjevling for his help in programming this experiment.</h3>
                </div>
            </div>
        );
    }
});

module.exports = FinalPage;
