import React, { Suspense, lazy } from 'react';
import Loading from './components/Loading';

const LazyHome = lazy(() => import('./components/Home'));
const LazyExplore = lazy(() => import('./components/Explore'));

/**
 A mapping of routes to `RouteProps`.
 The required property for each route is `element`, which must be a valid React component.

 This mapping is used in `src/app.tsx` to set up all the routes.
 * */
const routes: { [key: string]: import('react-router-dom').RouteProps } = {
    '/': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyHome />
            </Suspense>
        )
    },
    '/explore': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyExplore />
            </Suspense>
        )
    }
};

export default routes;
