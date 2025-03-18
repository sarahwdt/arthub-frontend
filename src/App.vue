<script setup>
import vuetify from "@/ts/vuetify/index.js";
import NotificationArea from "@/components/NotificationArea.vue";
import {ref} from "vue";

const navigation = ref(false);
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click.stop="navigation = !navigation"/>
      <v-spacer/>
      <v-btn @click="vuetify.locale.current.value = (vuetify.locale.current.value === 'ru' ? 'en' : 'ru')">
        {{ vuetify.locale.current.value }}
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="navigation">
      <v-list-item to="/clients">Clients</v-list-item>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
      <notification-area/>
    </v-main>
    <v-footer app>Footer example</v-footer>
  </v-app>
</template>

<style>
</style>
