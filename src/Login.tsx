import React from 'react';
import { Link, Navigate } from 'react-router-dom';

class Login extends React.Component {

    state: {
        values: any,
        authed: boolean
    }

    constructor(props: any) {
        super(props);

        const preServerURL = localStorage.getItem('serverURL');
        const preId = localStorage.getItem('id');
        const preToken = localStorage.getItem('token');

        const authed: boolean = !!preServerURL && !!preId && !!preToken;

        this.state = {
            values: {
                serverURL: '',
                username: '',
                password: ''
            },
            authed: authed
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.validate = this.validate.bind(this);
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
                    valid = response.status === 202 ? 1 : 0;
                } catch (e) {
                    valid = 0;
                }
                break;
            case 'password':
                const username: string = this.state.values.username;
                if (username.length === 0 || serverURL.length === 0) {
                    valid = 2;
                    break;
                }
                if (!serverURL.includes('http')) serverURL = `https://${serverURL}`;

                try {
                    const response = await fetch(`${serverURL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: username,
                            password: this.state.values.password
                        })
                    });
                    const json = await response.json();

                    if (response.status !== 200) {
                        alert('Error: ' + json.message);
                        valid = 0;
                        break;
                    }

                    localStorage.setItem('id', username);
                    localStorage.setItem('token', json.authToken);
                    localStorage.setItem('serverURL', serverURL);
                    
                    valid = 1;
                    break;
                } catch (e) {
                    console.log(e);
                    valid = 2;
                    break;
                }
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

    async onBlur(e: any) {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('name') as string;
        const value = target.value;

        if (target && name) {

            await this.validate(name, value);

        }

        this.setState(this.state);
    }

    async onSubmit() {

        let allValid = true;

        // Validate (& login with password)
        for (const i in this.state.values) {
            const isValid = await this.validate(i, this.state.values[i]) === 1;
            if (!isValid) allValid = false;
        }

        if (!allValid) {
            console.log('fail');
            return;
        }

        this.setState({
            authed: true
        });
    }

    render() {
        return (
            <div className='authBox'>
                {this.state.authed &&
                (<Navigate to={'/'} replace={true} />)
                }
                <div className="header">
                    <span>Log In</span>
                </div>
                <div className="inputBox">
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="serverURL">Server URL</label>
                            <input type="text" name='serverURL' onChange={this.onChange} onBlur={this.onBlur} value={this.state.values.serverURL} />
                            <span className="validText">Server available</span>
                            <span className="invalidText">Server not found</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                        <div className="inputWrap">
                            <label htmlFor="username">Username</label>
                            <input type="text" name='username' onChange={this.onChange} onBlur={this.onBlur} value={this.state.values.username} />
                            <span className="validText">User found</span>
                            <span className="invalidText">User not found</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputWrap">
                            <label htmlFor="password">Password</label>
                            <input type="password" name='password' onChange={this.onChange} value={this.state.values.password} />
                            <span className="validText"></span>
                            <span className="invalidText">Password incorrect</span>
                            <span className="spaceTaker">SPACETAKER</span>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <Link to={'/signup'} className="link">Don't have an account yet? Click here to make one.</Link>
                    <button className="button" type='button' onClick={this.onSubmit}>Log In</button>
                </div>
            </div>
        )
    }
}

export default Login;