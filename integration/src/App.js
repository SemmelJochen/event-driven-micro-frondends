
//import AppBar from 'navservice';
import { Grid } from "@mui/material";
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppBar from "./AppBar";
import { ServiceLoader, useFederatedComponent } from "./components/ServiceLoader";
//const ServiceADashboard = React.lazy(() => import("serviceA/Dashboard"))
//const ServiceBDashboard = React.lazy(() => import("serviceB/Dashboard"))



const styles = ({
    frame: {
        height: "100%",
        display: "flex",
        flexDirection: "column", // children will be rendered below each other, DO NOT WRAP!
    },
    appbar: {
        flex: 1, // be flexible, but use 1 / 2001 of space initially (height of AppBar will be set in AppBar)
    },
    container: {
        flex: 2000, // be flexible, but use 2000/2001 (almost all space you can get) for the content-container
        display: "flex", // the container is a flex-container itself
    },
    contentGrid: {
        display: "flex",
        flex: "1",
    },
});

function App() {
    const { Component: ServiceADashboard, error: serviceAError 
    } = useFederatedComponent(
        'http://localhost:3002/remoteEntry.js',
        'serviceA',
        './Dashboard'
    )
    const { Component: ServiceBDashboard, error: serviceBError
    } = useFederatedComponent(
        'http://localhost:3003/remoteEntry.js',
        'serviceB',
        './Dashboard'
    )
    console.log("error", serviceAError, serviceBError)
    return (
        <div style={styles.frame}>
            <BrowserRouter>
                <AppBar />
                {/*<ZebAppBar pmProxy={this.appBarProxy} className={classes.appbar} />*/}
                <Grid container style={styles.container} direction="column" wrap="nowrap">
                    <Routes>

                        <Route path="/servicea" element={
                            <ServiceLoader ServiceComponent={ServiceADashboard} error={serviceAError} />
                        }
                        />

                        <Route path="/serviceb" element={
                            <ServiceLoader ServiceComponent={ServiceBDashboard} error={serviceBError} />
                        }
                        />
                    </Routes>
                </Grid>
            </BrowserRouter>
        </div>
    );
}

export default App;
