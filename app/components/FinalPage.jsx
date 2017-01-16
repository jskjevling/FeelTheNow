var React = require('react');

var FinalPage = React.createClass({
    render: function () {
        return (
            <div className="thanks">
                <h1>Thank you for particiapting in this experiment.</h1>
                <h2>Results about the experiment will be posted on the IONS website within the coming months.</h2>
                <h3>Special thanks to Jeremy Skjevling for his help in programming this experiment.</h3>
            </div>
        );
    }
});

module.exports = FinalPage;
