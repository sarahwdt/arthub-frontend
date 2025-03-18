<script setup lang="ts">

import {Ref, toRef} from "vue";
import {api} from "@/ts/axios";
import {catchFieldErrors, notifyError, suppressError} from "@/ts/api";
import {FieldContext, useField, useForm, ValidationResult} from "vee-validate";
import {useI18n} from "vue-i18n";
import {AxiosRequestConfig} from "axios";
import {useNotificationStore} from "@/ts/stores/notification";

const localize = useI18n().t;
const notifications = useNotificationStore();

export interface FieldConfig {
  name: string,
  label: string,
  type: "text" | "textarea",
  validation: (v: string) => boolean | string | string[],
  field?: FieldContext<any>,
  props?: Record<string, any> | {} | any,
}

interface Props {
  baseUrl: string;
  localizationKey: string;
  searchApi?: {
    url?: string;
    method?: string;
  };
  get?: {
    url?: string;
    method?: string;
  };
  createApi?: {
    url?: string;
    method?: string;
  };
  updateApi?: {
    url?: string;
    method?: string;
  };
  deleteApi?: {
    url?: string;
    method?: string;
  };
  collectionName: string;
  searchResultProcessing: (x: Record<string, any>) => Record<string, any>;
}

const {
  baseUrl,
  localizationKey,
  searchApi,
  getApi,
  createApi,
  updateApi,
  deleteApi,
  collectionName, searchResultProcessing
} = defineProps<Props>();

const items = defineModel<Array<Record<string, any>>>('items', {default: []});
const page = defineModel<number>('page', {default: 0});
const size = defineModel<number>('items-per-page', {default: 10});
const totalItems = defineModel<number>('total-items', {default: 0});
const loading = defineModel<boolean>('loading', {default: false}) as Ref<boolean>;
const sortBy = defineModel<Array<{ key: string, order: string }>>('sortBy', {default: []});
const createFields = defineModel<Array<FieldConfig>>('createFields', {default: []});
const modifyFields = defineModel<Array<FieldConfig>>('modifyFields', {default: []});
const createObjectError = defineModel<string>('create-object-error', {default: ""});
const modifyObjectError = defineModel<string>('modify-object-error', {default: ""});
const createDialog = defineModel<boolean>('showCreateDialog', {default: false}) as Ref<boolean>;
const modifyDialog = defineModel<boolean>('showModifyDialog', {default: false}) as Ref<boolean>;

createFields.value.forEach(fieldConfig => fieldConfig.field = useField("create-" + fieldConfig.name, fieldConfig.validation));
modifyFields.value.forEach(fieldConfig => fieldConfig.field = useField("modify-" + fieldConfig.name, fieldConfig.validation));
const createSchema = {};
createFields.value.forEach(fieldConfig => createSchema["create-" + fieldConfig.name] = () => {});
const createForm = useForm()

const createSubmit = createForm.handleSubmit(v =>  {
  api.request({
    url: createApi?.url ?? baseUrl,
    method: createApi?.method ?? "POST",
    data: v,
  })
      .then((response) => {
        if (response.status === 201) {
          load({page: page.value, itemsPerPage: size.value, sortBy: sortBy.value});
          notifications.success("Успешно добавлено!")
          createDialog.value = false;
        }
      })
      .catch(catchFieldErrors(createFields.value.map(fieldConfig => fieldConfig.field), createObjectError))
      .catch(notifyError())
      .catch(suppressError())

});

async function modifySubmit() {
  let valid = true;
  for (const {field} in modifyFields.value) {
    const result: ValidationResult = field.validate();
    valid = valid && !!result.valid
  }
  if (!valid) return false;
  const data = {}
  for (const fieldConfig: FieldConfig in modifyFields.value) {
    data[fieldConfig.name] = fieldConfig.field.value;
  }
}

function load({page, itemsPerPage, sortBy}: {
  page: number,
  itemsPerPage: number,
  sortBy: { key: string, order: string }[]
}) {
  loading.value = true;
  api.request({
    url: searchApi?.url ?? baseUrl,
    method: searchApi?.method ?? "GET",
    params: {
      page: page - 1,
      size: itemsPerPage,
      sort: (sortBy ?? []).map(v => `${v?.key ?? ''},${v?.order ?? ''}`)
    }
  } as AxiosRequestConfig).then(res => {
    if (!!res.data) {
      totalItems.value = res.data.page.totalElements;
      items.value = (res.data?._embedded[collectionName] ?? []).map(searchResultProcessing)
    }
  })
      .catch(notifyError())
      .catch(suppressError())
      .finally(() => loading.value = false);
}
</script>

<template>
  <v-data-table-server
      :items="items"
      :page="page"
      :sort-by="sortBy"
      :items-per-page="size"
      :loading="loading"
      :items-length="totalItems"
      @update:options="load">
    <template v-slot:top>
      <v-toolbar density="compact" floating>
        <template v-slot:prepend>
          <v-toolbar-items variant="plain">
            <v-btn variant="elevated" prepend-icon="mdi-plus"
                   id="create-activator"
            >{{ localize(localizationKey + "button.create") }}
            </v-btn>
            <v-btn variant="elevated" prepend-icon="mdi-pen"
                   id="modify-activator"
            >{{ localize(localizationKey + "button.modify") }}
            </v-btn>
            <v-btn variant="elevated" prepend-icon="mdi-minus"> {{
                localize(localizationKey + "button.delete")
              }}
            </v-btn>
          </v-toolbar-items>
        </template>
      </v-toolbar>

      <v-dialog v-model="createDialog" activator="#create-activator" class="v-col-12 v-col-md-6 v-col-lg-4">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>{{ localize(localizationKey + "form.create.title") }}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon="mdi-close" @click="createDialog = !createDialog"></v-btn>
          </v-toolbar>
          <v-form @submit.prevent="createSubmit">
            <v-card-subtitle>{{ }}</v-card-subtitle>
            <v-card-text>
              <div v-for="fieldConfig of createFields">
                <v-textarea v-if="fieldConfig.type === 'textarea'"
                            v-model="fieldConfig.field.value"
                            :="
                              {
                                errorMessages: fieldConfig.field.errors,
                                label: localize(fieldConfig.label),
                                ...fieldConfig.props
                              }"
                            @click:clear="fieldConfig.field.handleReset"
                            clearable
                ></v-textarea>
                <v-text-field v-else
                              v-model="fieldConfig.field.value"
                              :="
                              {
                                errorMessages: fieldConfig.field.errors,
                                label: localize(fieldConfig.label),
                                ...fieldConfig.props
                              }"
                              @click:clear="fieldConfig.field.handleReset"
                              clearable
                ></v-text-field>
              </div>
              <v-toolbar>
                <v-spacer/>
                <v-btn prepend-icon="mdi-plus" color="green" class="me-4" variant="tonal" type="submit">
                  {{ localize(localizationKey + "form.create.button.create") }}
                </v-btn>
              </v-toolbar>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="modifyDialog" activator="#modify-activator" class="v-col-12 v-col-md-6 v-col-lg-4">
        <v-card>
          <v-card-subtitle>{{ modifyObjectError }}</v-card-subtitle>
          <v-toolbar>
            <v-toolbar-title>{{ localize(localizationKey + "form.modify.title") }}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon="mdi-close" @click="modifyDialog = !modifyDialog"></v-btn>
          </v-toolbar>
          <v-form @submit.prevent="modifySubmit" lazy-validation>
            <v-card-text>
              <div v-for="fieldConfig of modifyFields">
                <v-textarea v-if="fieldConfig.type === 'textarea'"
                            v-model="fieldConfig.field.value"
                            :="
                              {
                                errorMessages: fieldConfig.field.errors,
                                label: localize(fieldConfig.label),
                                ...fieldConfig.props
                              }"
                            @click:clear="fieldConfig.field.handleReset"
                            clearable
                ></v-textarea>
                <v-text-field v-else
                              v-model="fieldConfig.field.value"
                              :="
                              {
                                errorMessages: fieldConfig.field.errors,
                                label: localize(fieldConfig.label),
                                ...fieldConfig.props
                              }"
                              @click:clear="fieldConfig.field.handleReset"
                              clearable
                ></v-text-field>
              </div>
              <v-toolbar>
                <v-spacer/>
                <v-btn prepend-icon="mdi-pen" class="me-4" variant="tonal" color="blue">
                  {{ localize(localizationKey + "form.modify.button.modify") }}
                </v-btn>
              </v-toolbar>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

    </template>
  </v-data-table-server>
</template>

<style scoped>

</style>