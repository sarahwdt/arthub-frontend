<script setup>
import vuetify from "@/ts/vuetify/index.js";
import NotificationArea from "@/components/NotificationArea.vue";
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-spacer/>
      <v-btn @click="vuetify.locale.current.value = (vuetify.locale.current.value === 'ru' ? 'en' : 'ru')">
        {{ vuetify.locale.current.value }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view/>
      <NotificationArea/>
    </v-main>
    <v-footer app>Footer example</v-footer>
  </v-app>
</template>

<style>
</style>
