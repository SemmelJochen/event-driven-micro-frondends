import React from 'react';

const urlCache = new Set();
const componentCache = new Map();

function loadComponent(scope, module) {
    return async () => {
        // Initializes the share scope. This fills it with known provided modules from this build and all remotes
        await __webpack_init_sharing__('default');
        const container = window[scope]; // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        await container.init(__webpack_share_scopes__.default);
        const factory = await window[scope].get(module);
        const Module = factory();
        return Module;
    };
}

const useDynamicScript = url => {
    const [ready, setReady] = React.useState(false);
    const [{ isPresent, message }, setErrorLoading] = React.useState(false);

    React.useEffect(() => {
        if (!url) return;

        if (urlCache.has(url)) {
            setReady(true);
            setErrorLoading({ isPresent: false });
            return;
        }

        setReady(false);
        setErrorLoading({ isPresent: false });

        const element = document.createElement('script');

        element.src = url;
        element.type = 'text/javascript';
        element.async = true;

        element.onload = () => {
            urlCache.add(url);
            setReady(true);
        };

        element.onerror = (ev) => {
            //console.warn("loading error: ", ev)
            //get target url from error message
            let errorMessage = `Service on URL ${ev.target.outerHTML.split("src=")[1].split(" ")[0]} could not be loaded`
            console.warn(errorMessage)
            setReady(false);
            setErrorLoading({ isPresent: true, message: errorMessage });
        };

        document.head.appendChild(element);

        return () => {
            urlCache.delete(url);
            document.head.removeChild(element);
        };
    }, [url]);

    return {
        errorLoading: { isPresent, message },
        ready,
    };
};

export const useFederatedComponent = (remoteUrl, scope, module) => {
    const key = `${remoteUrl}-${scope}-${module}`;
    const [Component, setComponent] = React.useState(null);

    const { ready, errorLoading } = useDynamicScript(remoteUrl);
    React.useEffect(() => {
        if (Component) setComponent(null);
        // Only recalculate when key changes
    }, [key]);

    React.useEffect(() => {
        if (ready && !Component) {
            const Comp = React.lazy(loadComponent(scope, module));
            componentCache.set(key, Comp);
            setComponent(Comp);
        }
        // key includes all dependencies (scope/module)
    }, [Component, ready, key]);

    return { error: { isPresent: errorLoading.isPresent, message: errorLoading.message }, Component };
};

export const ServiceLoader = ({ ServiceComponent, error: { isPresent, message } }) => {
    return (

        <React.Suspense fallback="Loading System">
            {isPresent
                ? message
                : ServiceComponent && <ServiceComponent />}
        </React.Suspense>

    )
};
