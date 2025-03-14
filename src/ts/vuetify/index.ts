import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import {aliases, mdi} from "vuetify/iconsets/mdi";

import i18n from "@/ts/i18n";
import {createVueI18nAdapter} from "vuetify/locale/adapters/vue-i18n";
import {useI18n} from 'vue-i18n'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: 'dark'
    },
    locale: {
        adapter: createVueI18nAdapter({i18n, useI18n})
    }
});