import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './index.css';

import LandingPage from './components/LandingPage.vue';
import Whiteboard from './components/Whiteboard.vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort, BiEmojiSmile } from 'oh-vue-icons/icons';

addIcons(BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort, BiEmojiSmile);

let routes = [
    { path: '/', component: LandingPage },
    { path: '/whiteboard', name:"whiteboard", component: Whiteboard, props: true }
]

let router = createRouter({
    history: createWebHistory(),
    routes: routes
})

let app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(router);
app.mount('#app');

