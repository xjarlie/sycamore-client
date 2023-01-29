import React from 'react';
import { Navigate } from 'react-router-dom';
import { serverUrlFrom } from './lib/network';
import withOutletContext from './lib/withOutletContext';

class NewChat extends React.Component {

    state: {
        values: any,
        valid: boolean,
        chatURL: string
    }
    props: any;

    constructor(props: any) {
        super(props);

        this.state = {
            values: {
                serverURL: '',
                username: ''
            },
            valid: false,
            chatURL: ''
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
        let serverURL = serverUrlFrom(this.state.values.serverURL, true);

        switch (name) {
            case 'serverURL':
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

                try {
                    const response = await fetch(`${serverURL}/auth/checkUsername/${value}`);
                    valid = response.status === 202 ? 1 : 0;
                } catch (e) {
                    valid = 0;
                }
                break;
        }

        if (value.length ===0) valid = 2;

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

        // Validate
        for (const i in this.state.values) {
            const isValid = await this.validate(i, this.state.values[i]) === 1;
            if (!isValid) allValid = false;
        }

        if (!allValid) {
            console.log('fail');
            return;
        }


        this.setState({
            valid: true,
            chatURL: `${this.state.values.username}~${serverUrlFrom(this.state.values.serverURL, false)}`
        }, () => {
            this.props.outletContext.addChat(`${this.state.values.username}~${serverUrlFrom(this.state.values.serverURL, false)}`);
        });

    }



    render() {
        return (
            <div className='newChat'>
                {
                    this.state.valid &&
                    <Navigate to={`../${this.state.chatURL}`} />
                }
                <div className="newChatBox">
                    <span className='header'>New Chat</span>
                    <div className="inputBox">
                        <div className="row">
                            <div className="inputWrap">
                                <label htmlFor="serverURL">Server URL</label>
                                <input type="text" name='serverURL' value={this.state.values.serverURL} onBlur={this.onBlur} onChange={this.onChange} />
                                <span className="validText">Server available</span>
                                <span className="invalidText">Server not found</span>
                                <span className="spaceTaker">SPACETAKER</span>
                            </div>
                            <div className='inputWrap'>
                                <label htmlFor="username">Username</label>
                                <input type="text" name='username' value={this.state.values.username} onBlur={this.onBlur} onChange={this.onChange} />
                                <span className="validText">User found</span>
                                <span className="invalidText">User not found</span>
                                <span className="spaceTaker">SPACETAKER</span>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button type='button' className='button' onClick={this.onSubmit}>Create Chat</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withOutletContext(NewChat);