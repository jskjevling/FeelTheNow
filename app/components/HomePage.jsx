var React = require('react'),
    ButtonObject = require('ButtonObject'),
    ContentBlock = require('ContentBlock'),
    {hashHistory} = require('react-router');

var ageField,
    genderField,
    emailField,
    agreeField;


/* Since we're using React components to display our content, we keep the values here */
var content = {
    b1h: 'Purpose of the study',
    b1p: 'This experiment tests if it is possible to tell the difference between a video being streamed live vs. a recorded video. The idea is to see if people can mentally "feel" the thousands to millions of other minds watching a live video, vs. a recorded video where you are the only viewer.',
    b2h: 'Procedure',
    b2p: 'You will be shown a video that is either a live video or a pre-recorded video. Based on your intuition you will indicate if you feel that the video is live or not. The idea is that live video is being viewed by thousands to millions of people, whereas recorded video is only being viewed by you. Can you feel a difference? Does one video feel more "alive" to you than the other? You will have 10 seconds to answer.',
    b3h: 'Data collected in this study',
    b3p: 'All data collected in this study will be used by Institute of Noetic Sciences researchers only, and your participation, results and responses will be kept completely confidential within the limits of the law. Your name or email will not appear in any presentation of the data.',
    b4h: 'Risks and benefits',
    b4p: 'There are no known physical risks involved in participating in this type of experiment.  The only possible risk is that confidentiality might be accidentally violated, but given the nature of the task in this experiment we do not anticipate that that would entail any risk.',
    b5h: 'Freedom to withdraw',
    b5p: 'Your participation in this research is entirely voluntary. You are free to decline to be in this study, or to withdraw at any time for any reason.'
};

var HomePage = React.createClass({
    /*
     * We need to grab a few page elements, so we wait to ensure the component has
     * mounted before doing so. Otherwise the values may be undefined.
     */
    componentDidMount: function () {
        ageField = document.querySelector('input[name=age]');
        genderField = document.querySelector('select[name=gender]');
        emailField = document.querySelector('input[name=email]');
        agreeField = document.querySelector('#agree');
    },
    /*
     * Form submission logic and error checking.
     * The email is optional, but we still check it for validity if entered.
     */
    onFormSubmit: function (e) {
        e.preventDefault();
        var userDetails = {
            userAge: this.refs.age.value,
            userGender: this.refs.gender.value,
            userEmail: this.refs.email.value,
            doesAgree: this.refs.agree.checked
        };
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (userDetails.userAge.length === 0) {
            ageField.style.border = '2px solid red';
        } else {
            ageField.style.border = '';
        }
        if (userDetails.userGender.length === 0) {
            genderField.style.border = '2px solid red';
        } else {
            genderField.style.border = '';
        }
        if (userDetails.userEmail.length !== 0) {
            if (!emailReg.test(userDetails.userEmail)) {
                emailField.style.border = '2px solid red';
            } else {
                emailField.style.border = '';
            }
        }
        if (userDetails.doesAgree === false) {
            agreeField.style.color = 'red';
        } else {
            agreeField.style.color = '';
        }
        if (userDetails.userAge.length === 0 || userDetails.userGender.length === 0 ||  userDetails.doesAgree === false) {
            scroll(0,0);
            return;
        } else if (userDetails.userEmail.length > 0 && !emailReg.test(userDetails.userEmail)) {
            scroll(0,0);
            return;
        } else {
            this.props.onDataSubmit(userDetails);
            hashHistory.push('/video');
        }
    },
    render: function () {
        return (
            <div>
                <h1>Please enter your information:</h1>
                <p className="note">* indicates a required field</p>
                <form onSubmit={this.onFormSubmit}>
                    <section className="inputs">
                        <input type="number" name="age" ref="age" min="1" max="150" placeholder="Age*"/>
                        <select name="gender" ref="gender">
                            <option value="">Gender*</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        <input type="text" name="email" ref="email" placeholder="Email (optional)"/>
                        <label id="agree"><span>I agree to participate in this experiment*</span><input type="checkbox" ref="agree"/></label>
                    </section>
                    <section className="description-box">
                        <ContentBlock classes="description white large" heading={content.b1h} paragraphText={content.b1p}/>
                        <ContentBlock classes="description blue large" heading={content.b2h} paragraphText={content.b2p}/>
                        <ContentBlock classes="description light-blue" heading={content.b3h} paragraphText={content.b3p}/>
                        <ContentBlock classes="description dark-blue" heading={content.b4h} paragraphText={content.b4p}/>
                        <ContentBlock classes="description white" heading={content.b5h} paragraphText={content.b5p}/>
                    </section>
                    <ButtonObject label="OK, I'm ready!"/>
                </form>
            </div>
        );
    }
});

module.exports = HomePage;
