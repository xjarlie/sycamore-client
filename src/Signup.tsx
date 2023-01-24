import React from "react";
import withLoaderData from "./lib/withLoaderData";
import { Link, Navigate } from "react-router-dom";

class Signup extends React.Component {

    state: {
        values: any,
        authed: boolean
    }

    constructor(props: any) {
        super(props);

        this.state = {
            values: {
                serverURL: '',
                username: '',
                password: '',
                password2: '',
                displayName: ''
            },
            authed: false
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.validate = this.validate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    async onBlur(e: any) {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('name') as string;
        const value = target.value;

        if (target && name) {

            await this.validate(name, value);

        }

        this.setState(this.state);
    }

    async validate(name: string, value: string): Promise<number> {
        let valid = 2;
        let serverURL = this.state.values.serverURL;


        switch (name) {
            case 'serverURL':
                if (!value.includes('http')) serverURL = `https://${serverURL}`;

                try {
                    const response = await fetch(`${serverURL}/server-info`);
                    valid = response.status === 200 ? 1 : 0;
                } catch (e) {
                    valid = 0;
                }
                break;
            case 'username':
                if (serverURL.length === 0) {
                    valid = 2;
                    break;
                }

                if (!serverURL.includes('http')) serverURL = `https://${serverURL}`;

                try {

                    const response = await fetch(`${serverURL}/auth/checkUsername/${value}`);
                    valid = response.status === 200 ? 1 : 0;

                } catch (e) {
                    valid = 0;
                }
                break;
            case 'password':
                // const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*)(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{8,}$");
                const test = value.length >= 8;
                valid = test ? 1 : 0;
                break;
            case 'password2':
                valid = this.state.values.password === this.state.values.password2 ? 1 : 0;
                break;
            case 'displayName':
                valid = value.length > 3? 1 : 0;
                break;

        }

        if (value.length === 0) valid = 2;

        if (valid === 1) {
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.add('valid');
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.remove('invalid');
        } else if (valid === 0) {
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.remove('valid');
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.add('invalid');
        } else {
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.remove('valid');
            document.querySelector(`input[name="${name}"]`)?.parentElement?.classList.remove('invalid');
        }

        return valid;
    }

    async onSubmit() {

        let allValid = true;

        // Validate
        for (const i in this.state.values) {
            const isValid = await this.validate(i, this.state.values[i]) === 1;
            if (!isValid) {
                allValid = false;
            }
        }

        if (!allValid) {
            console.log('fail');
            return;
        }

        // Signup
        const data: {
            username: string,
            password: string,
            displayName: string
        } = {
            username: this.state.values.username,
            password: this.state.values.password,
            displayName: this.state.values.displayName
        };
        let serverURL: string = this.state.values.serverURL;

        if (!serverURL.includes('http')) serverURL = `https://${serverURL}`;
        const response = await fetch(`${serverURL}/auth/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
        console.log(response.status, json);

        if (response.status !== 201) {
            alert('Error: ' + json.message);
            return;
        }

        // Login
        const loginResponse = await fetch(`${serverURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: data.username, password: data.password })
        });
        const loginJson = await loginResponse.json();
        console.log(loginResponse.status, loginJson);

        if (loginResponse.status !== 200) {
            alert('Error: ' + loginJson.message);
            return;
        }

        localStorage.setItem('id', data.username);
        localStorage.setItem('token', loginJson.authToken);
        localStorage.setItem('serverURL', serverURL);

        this.setState({
            authed: true
        });

    }

    render() {
        return (
            <div className="authBox">
                {this.state.authed &&
                (<Navigate to={'/'} replace={true} />)
                }
                <div className="header">
                    <span>Create an Account</span>
                </div>
                <div className="inputBox">
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="serverURL">Server URL</label>
                            <input name="serverURL" onBlur={this.onBlur} onChange={this.onChange} value={this.state.values.serverURL} type="text" />
                            <span className="validText">Server available</span>
                            <span className="invalidText">Server not found</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                        <div className="inputWrap">
                            <label htmlFor="username">Username</label>
                            <input name="username" onBlur={this.onBlur} onChange={this.onChange} value={this.state.values.username} type="text" />
                            <span className="validText">Username available</span>
                            <span className="invalidText">Username not available</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="password">Password</label>
                            <input name="password" onBlur={this.onBlur} onChange={this.onChange} value={this.state.values.password} type="password" />
                            <span className="validText">Password valid</span>
                            <span className="invalidText">Must be at least 8 characters</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                        <div className="inputWrap">
                            <label htmlFor="password2">Re-enter password</label>
                            <input name="password2" onBlur={this.onBlur} onChange={this.onChange} value={this.state.values.password2} type="password" />
                            <span className="validText">Passwords match</span>
                            <span className="invalidText">Passwords do not match</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="displayName">Display name</label>
                            <input name="displayName" onBlur={this.onBlur} onChange={this.onChange} value={this.state.values.displayName} type="text" />
                            <span className="validText"></span>
                            <span className="invalidText">Must be over 3 characters</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <Link to={'/login'} className="link">Already have an account? Click here to log in.</Link>
                    <button type="button" onClick={this.onSubmit} className="button">Create Account</button>
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