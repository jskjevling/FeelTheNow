var React = require('react');

var ContentBlock = React.createClass({
    render: function () {
        var heading = this.props.heading;
        var paragraph = this.props.paragraphText;
        var classes = this.props.classes;

        return (
            <div className={classes}>
                <h2>{heading}</h2>
                <p>{paragraph}</p>
            </div>
        );
    }
});

module.exports = ContentBlock;
