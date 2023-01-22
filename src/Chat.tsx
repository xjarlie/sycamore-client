import React from 'react';
import withLoaderData from './lib/withLoaderData';

class Chat extends React.Component {
    props: any;

    render() {
        console.log(this.props.loaderData);
        return(
            <h3>This is chat with username: {this.props.loaderData.chatID} </h3>
        )
    }
}

function loader({ params }: {params: any}) {
    return {chatID: params.chatID};
}

export {loader};
export default withLoaderData(Chat);