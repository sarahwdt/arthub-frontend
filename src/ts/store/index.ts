import {createPinia, defineStore, setActivePinia} from 'pinia'

const pinia = createPinia();

setActivePinia(pinia);
export default pinia;
export {
    defineStore
}