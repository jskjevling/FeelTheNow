var React = require('react');

var ButtonObject = React.createClass({
    getDefaultProps: function () {
        return {
            label: 'Submit',
            click: null
        }
    },
    render: function () {
        var label = this.props.label;
        var click = this.props.click;
        return (
            <button className="button expanded">{label}</button>
        );
    }
});

module.exports = ButtonObject;
