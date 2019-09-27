import React from 'react';
import { Link } from 'react-router-dom';

class UserSignUp extends React.Component {

    // setting the nitial state
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        errors: {},
        confirmSignInMsg: null,

    }

// input handling
    
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    // Handling create new user and credentials
    submit = (e) => {
        e.preventDefault();
        const { context } = this.props;

        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        } = this.state;

        let user = {};

        if (firstName === '' || lastName === '' || emailAddress === '' || password === '' || confirmPassword === '') {
            this.setState({
                errors: ["Missing information - Please check all fields are entered correctly"]
            })
            return;

        }

        // error messages if passwords arent matching

        if (password !== confirmPassword) {
            this.setState({
                errors: ["Passwords do not match. Please re-confirm"]
            })
            return;
            // Otherwise set properties for user
        } else {
            user = {
                firstName,
                lastName,
                emailAddress,
                password
            };
        }

        context.data.createUser(user)
            .then(errors => {
               
                if (errors.length) {
                    this.setState({ errors: errors });
                } else {
                    this.setState({ errors: [] });
                    
                    context.actions.signIn(emailAddress, password)
                        .then(user => this.props.history.push('/'))
                        .catch(err => {
                            
                            console.log(err);
                            this.props.history.push('/error');
                        })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    errors: ["Email address is already associated with another user. Please try another"]
                })
            });
    }

    render() {
       
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    {/* Ternary operator shows errors only when they exist */}
                    {
                        this.state.errors.length ?
                            <div>
                                <h2 className="validation--errors--label">Error creating account:</h2>
                                <div className="validation-errors">
                                    <ul>
                                        {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
                                    </ul>
                                </div>
                            </div> : null
                    }
                    {/* Ternary operator shows confirm sign-in message only if it exist */}
                    {
                        this.state.confirmSignInMsg ?
                            <div>
                                <div className="validation-errors">
                                    <ul>
                                        <li>You are good to go! <a style={{ fontWeight: "bold" }} href="/signin">Sign In</a>!</li>
                                    </ul>
                                </div>
                            </div> : null
                    }
                    <div>
                        <form onSubmit={this.submit}>
                            <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={this.change} value={firstName} /></div>
                            <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={this.change} value={lastName} /></div>
                            <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={this.change} value={emailAddress} /></div>
                            <div><input id="password" name="password" type="password" className="" placeholder="Password" onChange={this.change} value={password} /></div>
                            <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                                onChange={this.change} value={confirmPassword} /></div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign Up</button>
                                <Link className="button button-secondary" to="/">Cancel</Link>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <a href="/signin">Click here</a> to sign in!</p>
                </div>
            </div>
        );
    }
}
export default UserSignUp