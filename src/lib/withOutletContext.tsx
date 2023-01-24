import { useOutletContext } from 'react-router-dom';

function withOutletContext(Component: any) {
    function WrappedComponent(props: any) {
        let outletContext = useOutletContext();
        return <Component {...props} outletContext={outletContext} />
    }
    return WrappedComponent;
}

export default withOutletContext;