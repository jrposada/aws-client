import { createRoute } from '@tanstack/react-router';
import HomeRoute from './features/home/home-route';
import { rootRoute } from './root-route';

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeRoute,
});

export const routes = [homeRoute];
