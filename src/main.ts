import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort } from 'oh-vue-icons/icons';

addIcons(BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort);

let app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');

