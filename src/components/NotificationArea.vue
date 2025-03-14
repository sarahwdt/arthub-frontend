<script setup lang="ts">
import {useNotificationStore} from "@/ts/stores/notification";
import {computed, ref} from "vue";

const store = useNotificationStore()

const messages = computed(() => store.messages)
const snackbar = ref(true)
function remove(id: string) {
  store.remove(id)
}
</script>

<template>
  <v-snackbar v-model="snackbar" location="right top" min-height="0" timeout="-1" variant="plain">
    <div class="notification-area">
      <transition-group name="list" tag="div">
        <v-alert
            variant="tonal"
            border="end"
            v-for="msg in messages"
            :key="msg.id"
            :type="msg.type"
            :title="msg.title"
            :text="msg.message"
            prominent
            closable
            @click:close="remove(msg.id)"
        ></v-alert>
      </transition-group>
    </div>
  </v-snackbar>
</template>

<style scoped>

</style>