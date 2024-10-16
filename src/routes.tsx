import React, { Suspense, lazy } from 'react';
import Loading from './components/Loading';

const LazyHome = lazy(() => import('./components/Home'));
const LazyExplore = lazy(() => import('./components/Explore'));
const LazyDroughtResistantSeed = lazy(() => import('./components/DroughtResistantSeed'));
const LazyCropRotation = lazy(() => import('./components/CropRotation'));

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
    'explore': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyExplore />
            </Suspense>
        )
    },
    'drought-resistant-seeds/:research_id': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyDroughtResistantSeed />
            </Suspense>
        )
    },
    'crop-rotation/:research_id': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyCropRotation />
            </Suspense>
        )
    }
};

export default routes;
