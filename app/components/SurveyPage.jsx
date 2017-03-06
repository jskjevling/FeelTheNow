var React = require('react'),
    ButtonObject = require('ButtonObject'),
    Header = require('Header'),
    Footer = require('Footer'),
    {hashHistory} = require('react-router');

var record = function record(e){
    e.preventDefault();
    hashHistory.push('/thankyou');
};

var SurveyPage = React.createClass({
    render: function () {
        return (
            <div>
                <div className="row">
                    <form onSubmit={record}>
                        <div className="row">
                            <h1 className="small-12 column text-center">Thank you for your response.</h1>
                        </div>
                        <div className="row">
                            <h3 className="small-12 column text-center">Almost done!</h3>
                        </div>
                        <div className="row">
                            <h2 className="small-12 column text-center question light-blue">Did you notice any hint on the video that suggested it was live or not?</h2>
                        </div>
                        <div className="row">
                            <section className="inputs small-10 medium-8 large-6 column small-centered medium-centered large-centered text-center">
                                <div className="row">
                                    <label className="small-6 column text-center"><span>No</span><input type="radio" name="tipoff"/></label>
                                    <label className="small-6 column text-center"><span>Yes</span><input type="radio" name="tipoff"/></label>
                                </div>
                            </section>
                        </div>
                        <div className="row">
                            <section className="inputs small-10 medium-8 large-6 column small-centered medium-centered large-centered text-center">
                                <label><span className="explain">If yes, please explain:</span><input type="textarea" name="reason"/></label>
                            </section>
                        </div>
                        <div className="row">
                            <div className="small-10 medium-6 column small-centered medium-centered text-center pad-20">
                                <ButtonObject/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

module.exports = SurveyPage;
