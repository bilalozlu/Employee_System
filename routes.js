import { Router } from '@vaadin/router';
import './views/employee-list.js';
import './views/employee-form.js';

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes([
    { path: '/', component: 'employee-list' },
    { path: '/add', component: 'employee-form' },
    { path: '/edit/:id', component: 'employee-form' },
    { path: '(.*)', redirect: '/' }
  ]);
}