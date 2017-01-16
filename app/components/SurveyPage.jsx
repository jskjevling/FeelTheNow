var React = require('react'),
    ButtonObject = require('ButtonObject'),
    {hashHistory} = require('react-router');

var record = function record(e){
    e.preventDefault();
    hashHistory.push('/thankyou');
};

var SurveyPage = React.createClass({
    render: function () {
        return (
            <div>
                <form onSubmit={record}>
                    <h1>Thank you for your response.</h1>
                    <h3>Almost done!</h3>
                    <h2 className="question light-blue">Did you notice any hint on the video that suggested it was live or not?</h2>
                    <section className="inputs">
                        <label><span>No</span><input type="radio" name="tipoff"/></label>
                        <label><span>Yes</span><input type="radio" name="tipoff"/></label>
                    </section>
                    <section className="inputs">
                        <label><span className="explain">If yes, please explain:</span><input type="textarea" name="reason"/></label>
                    </section>
                    <ButtonObject/>
                </form>
            </div>
        );
    }
});

module.exports = SurveyPage;
