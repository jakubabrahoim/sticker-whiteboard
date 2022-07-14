import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSticky } from 'oh-vue-icons/icons';

addIcons(BiSticky);

let app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');

