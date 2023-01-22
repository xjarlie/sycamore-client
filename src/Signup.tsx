import React from "react";
import withLoaderData from "./lib/withLoaderData";

class Signup extends React.Component {

    state: {
        values: any
    }

    constructor(props: any) {
        super(props);

        this.state = {
            values: {
                serverURL: 'chat.xjarlie.com',
                username: '',
                password: '',
                password2: '',
                displayName: '',
                buttonEnabled: false
            }

        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e: any) {
        const prevValues = this.state.values;

        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('name') as string;


        if (e && e.target && name) {
            prevValues[name] = target.value;
            this.setState({
                values: prevValues
            });
        }
    }

    render() {
        const buttonEnabled = this.state.values.buttonEnabled;
        return (
            <div className="authBox">
                <div className="header">
                    <span>Create an Account</span>
                </div>
                <div className="inputBox">
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="serverURL">Server URL</label>
                            <input name="serverURL" onChange={this.onChange} value={this.state.values.serverURL} type="text" />
                        </div>
                        <div className="inputWrap">
                            <label htmlFor="username">Username</label>
                            <input name="username" onChange={this.onChange} value={this.state.values.username} type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="password">Password</label>
                            <input name="password" onChange={this.onChange} value={this.state.values.password} type="password" />
                        </div>
                        <div className="inputWrap">
                            <label htmlFor="password2">Re-enter password</label>
                            <input name="password2" onChange={this.onChange} value={this.state.values.password2} type="password" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="displayName">Display name</label>
                            <input name="displayName" onChange={this.onChange} value={this.state.values.displayName} type="password" />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <span className="link">Already have an account? Click here to log in.</span>
                    <button type="button" className="button">Create Account</button>
                </div>
            </div>
        )
    }
}

function loader() {
    return null;
}

export { loader };
export default withLoaderData(Signup);