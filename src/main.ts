import './assets/main.css'

import {createApp} from 'vue'

// Components
import router from '@/ts/router';
import vuetify from '@/ts/vuetify';
import pinia from "@/ts/store";
import i18n from "@/ts/i18n"
import App from "@/App.vue";

createApp(App).use(vuetify).use(router).use(pinia).use(i18n).mount('#app')
