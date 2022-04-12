import React from 'react';
import { Routes as RouterRoutes } from 'react-router-dom';

const Routes = ({ children }) => {
    return (
        <RouterRoutes >
            {children}
        </RouterRoutes >
    )
}
export default Routes;