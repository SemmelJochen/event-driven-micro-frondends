import { Typography } from '@mui/material';
import { Box } from '@mui/system';
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
        error: { isPresent, message },
        ready,
    };
};

export const useFederatedComponent = (remoteUrl, scope, module) => {
    const key = `${remoteUrl}-${scope}-${module}`;
    const [Component, setComponent] = React.useState(null);

    const { ready, error } = useDynamicScript(remoteUrl);
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
    let errorMessage
    if (error.isPresent) {
        errorMessage = ` Service on URL ${remoteUrl} could not be reached while trying to load [${scope}/${module.split("./")[1]}]`
    }
    return { error: { isPresent: error.isPresent, message: errorMessage ? errorMessage : error.message }, Component };
};

export const ServiceLoader = ({ ServiceComponent, error: { isPresent, message } }) => {
    const ErrorWindow = () => {
        return (
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                width={"100%"} height={"100%"} margin={5}>
                <Typography variant='h4' textAlign={"center"}>
                    {message}
                </Typography>
            </Box>
        )
    }
    return (

        <React.Suspense fallback="Loading System">
            {isPresent
                ? <ErrorWindow />
                : ServiceComponent && <ServiceComponent />}
        </React.Suspense>

    )
};

