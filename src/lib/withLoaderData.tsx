import { useLoaderData } from 'react-router-dom';

function withLoaderData(Component: any) {
    function WrappedComponent(props: any) {
        let loaderData = useLoaderData();
        return <Component {...props} loaderData={loaderData} />
    }
    return WrappedComponent;
}

export default withLoaderData;