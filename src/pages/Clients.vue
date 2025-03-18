<script setup lang="ts">
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import RestDataTable, {FieldConfig} from "@/components/RestDataTable.vue";

const localize = useI18n().t;
const EMAIl_REGEX = /^[\w0-9.%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const headers = ref([
  {title: computed(() => localize("page.clients.headers.name")), key: "name", align: "start"},
  {title: computed(() => localize("page.clients.headers.email")), key: "email", align: "center"},
  {title: computed(() => localize("page.clients.headers.phone")), key: "phone", align: "end"},
]);

const fieldKey = "page.clients.form.create.field."
const validationKey = "page.clients.form.create.validation."

const createFields = ref<Array<FieldConfig>>([
  {
    name: "lastName",
    label: fieldKey + "lastName",
    type: "text",
    validation: v => {
      if (!v) return localize(validationKey + "lastName.required");
      const errors = [];
      if ((v?.trim() ?? "").length === 0) errors.push(localize(validationKey + "lastName.required"));
      if ((v.trim() ?? "").length > 128) errors.push(localize(validationKey + "lastName.max", {n: 128}, 12));
      return errors.length === 0 ? true : errors.join(", ");
    },
    props: {
      counter: 128
    },
  } as FieldConfig,
  {
    name: "firstName",
    label: fieldKey + "firstName",
    type: "text",
    validation: v => {
      if (!v) return localize(validationKey + "firstName.required");
      const errors = [];
      if ((v?.trim() ?? "").length === 0) errors.push(localize(validationKey + "firstName.required"));
      if ((v.trim() ?? "").length > 64) errors.push(localize(validationKey + "firstName.max", {n: 64}, 64));
      return errors.length === 0 ? true : errors.join(", ");
    },
    props: {
      counter: 64
    }
  } as FieldConfig,
  {
    name: "patronymic",
    label: fieldKey + "patronymic",
    type: "text",
    validation: v => (v?.trim() ?? "").length > 64 ? localize(validationKey + "patronymic.max", {n: 64}, 64) : true,
    props: {
      counter: 64
    }
  } as FieldConfig,
  {
    name: "email",
    label: fieldKey + "email",
    type: "text",
    validation: v => {
      if (!v) return localize(validationKey + "email.required");
      const errors = [];
      if ((v?.trim() ?? "").length === 0) errors.push(localize(validationKey + "email.required"));
      if ((v.trim() ?? "").length > 320) errors.push(localize(validationKey + "email.max", {n: 320}, 320));
      if (!EMAIl_REGEX.test(v)) errors.push(localize(validationKey + "email.pattern"));
      return errors.length === 0 ? true : errors.join(", ");
    },
    props: {
      counter: 320
    }
  } as FieldConfig,
  {
    name: "phone",
    label: fieldKey + "phone",
    type: "text",
    validation: v => {
      if (!v) return localize(validationKey + "phone.required");
      const errors = [];
      if ((v?.trim() ?? "").length === 0) errors.push(localize(validationKey + "phone.required"));
      if ((v.trim() ?? "").length > 30) errors.push(localize(validationKey + "phone.max", {n: 30}, 30));
      return errors.length === 0 ? true : errors.join(", ");
    },
    props: {
      counter: 30
    }
  } as FieldConfig,
])

const modifyFields = ref<Array<FieldConfig>>([...createFields.value.map(v => ({...v}))])

const itemsPerPage = ref(5)

</script>

<template>
  <RestDataTable
      :base-url="'/api/clients'"
      :localization-key="'page.clients.'"
      :collection-name="'clients'"
      :search-result-processing="(item) => ({name: [item.lastName, item.firstName, item.patronymic].join(' '), ...item })"
      :headers="headers"
      :create-fields="createFields"
      :modify-fields="modifyFields"
      :items-per-page="itemsPerPage"

      multi-sort
      item-value="name"
  ></RestDataTable>
</template>

<style scoped>

</style>