import {createRouter, createWebHistory} from "vue-router";
import Login from "@/pages/login/Login.vue";
import {useAuthStore} from "@/ts/stores/auth";
import Clients from "@/pages/Clients.vue";

const routes = [
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
      name: 'clients',
      path: '/clients',
      component: Clients,
      meta: {
          authRequired: true,
      }
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        meta: {
            authRequired: true,
        }
    },
    {
        name: 'bad-not-found',
        path: '/:pathMatch(.*)',
        meta: {
            authRequired: true,
        }
    }
];


let router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record?.meta?.authRequired)) {
        if (!useAuthStore().isAuthenticated()) {
            next({name: 'login', query: {redirect: to.fullPath}});
        } else {
            next();
        }
    } else {
        next();
    }
})
export default router;