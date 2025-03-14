<script setup lang="ts">
import {apiPublic} from "@/ts/axios";
import {useField, useForm} from "vee-validate"
import {ref} from "vue";
import {AuthTokenImpl, useAuthStore} from "@/ts/stores/auth";
import {useRouter} from "vue-router";
import {catchFieldErrors, notifyError, suppressError} from "@/ts/api";
import {useI18n} from 'vue-i18n'
import {useNotificationStore} from "@/ts/stores/notification";

const CAPITAL_LETTER_REGEX = /\p{Lu}/v;
const LOWER_LETTER_REGEX = /\p{Ll}/v;
const SPECIAL_CHARACTER_REGEX = /\p{P}/v;
const DIGIT_REGEX = /\d/;
const EMAIl_REGEX = /^[\w0-9.%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const tabs = ref("0");
const showLoginPassword = ref(false);
const showRegistrationPassword = ref(false);
const showRegistrationConfirmation = ref(false);

const router = useRouter();
const notifications = useNotificationStore();
const localize = useI18n().t;

const {handleSubmit, handleReset} = useForm({
  validationSchema: {
    email: (v: string) => {
      if (!v?.trim()) return localize("page.login.form.validation.email.required");
      if (tabs.value === "0") return true;
      if (!EMAIl_REGEX.test(v)) return localize("page.login.form.validation.email.pattern");
      return true;
    },
    password: (v: string) => {
      if (!v?.trim()) return localize("page.login.form.validation.password.required");
      if (tabs.value === "0") return true;
      if (v.length < 8) return localize("page.login.form.validation.password.min", {n: 8}, 8);
      if (v.length > 64) return localize("page.login.form.validation.password.max", {n: 64}, 64);
      if (!CAPITAL_LETTER_REGEX.test(v)) return localize("page.login.form.validation.password.uppercase");
      if (!LOWER_LETTER_REGEX.test(v)) return localize("page.login.form.validation.password.lowercase");
      if (!SPECIAL_CHARACTER_REGEX.test(v)) return localize("page.login.form.validation.password.special");
      if (!DIGIT_REGEX.test(v)) return localize("page.login.form.validation.password.digit");
      return true;
    },
    passwordConfirmation: (v: string) => {
      if (tabs.value === "0") return true;
      if (!v?.trim()) return localize("page.login.form.validation.passwordConfirmation.required");
      if (password.value.value !== v) return localize("page.login.form.validation.passwordConfirmation.match");
      return true;
    },
  }
})

const objectErrors = ref("");

const email = useField('email');
const password = useField('password');
const passwordConfirmation = useField('passwordConfirmation');

const fields = {email, password, passwordConfirmation};

const toLogin = () => tabs.value = "0";
const toRegister = () => tabs.value = "1";

const submit = handleSubmit(values => {
  if (tabs.value === "0") {

    apiPublic.post("/auth/login", {email: values.email, password: values.password})
        .then(res => {
          if (AuthTokenImpl.is(res.data)) {
            useAuthStore().setAuth(res.data);
            const redirect = router.currentRoute.value.query.redirect instanceof Array ?
                router.currentRoute.value.query.redirect[0] : router.currentRoute.value.query.redirect;
            router.push(redirect || '/');
          }
        })
        .catch(catchFieldErrors(fields, objectErrors))
        .catch(notifyError())
        .catch(suppressError())
  } else if (tabs.value === "1") {

    apiPublic.post("/auth/registration", {...values})
        .then(res => {
          if (res.status === 201) {
            password.value.value = "";
            tabs.value = "0";
            notifications.success(localize("page.login.form.registration.notification.success.body"),
                localize("page.login.form.registration.notification.success.title"), 10000)
          }
        })
        .catch(catchFieldErrors(fields, objectErrors))
        .catch(notifyError)
        .catch(suppressError);
  }
})
const reset = () => {
  objectErrors.value = "";
  handleReset();
}
</script>

<template>
  <v-container fluid>
    <v-row align-center justify-center>
      <v-spacer/>
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-form ref="loginForm" @submit.prevent="submit" lazy-validation>
            <v-tabs-window v-model="tabs">
              <v-tabs-window-item :value="0">
                <v-toolbar>
                  <v-toolbar-title>{{ localize('page.login.form.login.title') }}</v-toolbar-title>
                </v-toolbar>
                <div class="pa-2">
                  <v-card-subtitle class="text-red-lighten-2">{{ objectErrors }}</v-card-subtitle>
                </div>
                <v-card-text>
                  <v-text-field
                      v-model="email.value.value"
                      :error-messages="email.errorMessage.value"
                      :label="localize('page.login.form.field.email')"
                      clearable></v-text-field>
                  <v-text-field
                      v-model="password.value.value"
                      :error-messages="password.errorMessage.value"
                      :append-inner-icon="showLoginPassword? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showLoginPassword ? 'text' : 'password'"
                      :label="localize('page.login.form.field.password')"
                      @click:append-inner="showLoginPassword = !showLoginPassword"
                      clearable></v-text-field>


                  <v-toolbar>
                    <div class="px-4">{{ localize("page.login.form.login.toRegister.text") }}
                      <a href="" @click.prevent="toRegister()">{{
                          localize("page.login.form.login.toRegister.link")
                        }}</a></div>
                    <v-spacer/>
                    <v-btn hidden="until-found" prepend-icon="mdi-cancel" class="me-4" @click="reset">
                      {{ localize("page.login.form.login.button.clear") }}
                    </v-btn>
                    <v-btn prepend-icon="mdi-login" class="me-4" type="submit">
                      {{ localize("page.login.form.login.button.login") }}
                    </v-btn>
                  </v-toolbar>
                </v-card-text>
              </v-tabs-window-item>
              <v-tabs-window-item :value="1">
                <v-toolbar>
                  <v-toolbar-title>{{ localize('page.login.form.registration.title') }}</v-toolbar-title>
                </v-toolbar>
                <div class="pa-2">
                  <v-card-subtitle class="text-red-lighten-2">{{ objectErrors }}</v-card-subtitle>
                </div>
                <v-card-text>
                  <v-text-field
                      v-model="email.value.value"
                      :error-messages="email.errorMessage.value"
                      :label="localize('page.login.form.field.email')"
                      type="email"
                      clearable></v-text-field>

                  <v-text-field
                      v-model="password.value.value"
                      :counter="64"
                      :error-messages="password.errorMessage.value"
                      :append-inner-icon="showRegistrationPassword? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showRegistrationPassword ? 'text' : 'password'"
                      :label="localize('page.login.form.field.password')"
                      :hint="localize('page.login.form.registration.hint.password', {l:8, r:64}, 100)"
                      @click:append-inner="showRegistrationPassword = !showRegistrationPassword"
                      clearable></v-text-field>

                  <v-text-field
                      v-model="passwordConfirmation.value.value"
                      :error-messages="passwordConfirmation.errorMessage.value"
                      :append-inner-icon="showRegistrationConfirmation? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showRegistrationConfirmation ? 'text' : 'password'"
                      :label="localize('page.login.form.field.passwordConfirmation')"
                      @click:append-inner="showRegistrationConfirmation = !showRegistrationConfirmation"
                      clearable></v-text-field>

                  <v-toolbar>
                    <div class="px-4">{{ localize("page.login.form.registration.toLogin.text") }}
                      <a href="" @click.prevent="toLogin()">{{
                          localize("page.login.form.registration.toLogin.link")
                        }}</a></div>
                    <v-spacer/>
                    <v-btn hidden="until-found" prepend-icon="mdi-cancel" class="me-4" @click="reset">
                      {{ localize("page.login.form.registration.button.clear") }}
                    </v-btn>
                    <v-btn prepend-icon="mdi-login" class="me-4" type="submit">
                      {{ localize("page.login.form.registration.button.register") }}
                    </v-btn>
                  </v-toolbar>
                </v-card-text>

              </v-tabs-window-item>
            </v-tabs-window>
          </v-form>
        </v-card>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>