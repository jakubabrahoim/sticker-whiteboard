import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './index.css';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import LandingPage from './components/LandingPage.vue';
import Whiteboard from './components/Whiteboard.vue';
import UML from './components/UML.vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort, BiEmojiSmile, CoFullscreen, BiCardImage } from 'oh-vue-icons/icons';

addIcons(BiSticky, BiPlusLg, CoMinus, CoSave, BiCloudUpload, BiArrowRightShort, BiEmojiSmile, CoFullscreen, BiCardImage);

const firebaseConfig = {
    apiKey: "AIzaSyCjkFl06qXGER6Q3aYGsz6i5VcmsoI3IRw",
    authDomain: "whiteboard-sticky-notes.firebaseapp.com",
    projectId: "whiteboard-sticky-notes",
    storageBucket: "whiteboard-sticky-notes.appspot.com",
    messagingSenderId: "393079115439",
    appId: "1:393079115439:web:c1ca2f94a892ff1a10ce5a",
    measurementId: "G-K7G7W42K1M"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const analytics = getAnalytics(firebaseApp);

let routes = [
    { path: "/", component: LandingPage },
    { path: "/whiteboard", name:"whiteboard", component: Whiteboard, props: true },
    { path: "/uml", name: "uml", component: UML, props: true}
]

let router = createRouter({
    history: createWebHistory(),
    routes: routes
})

let app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(router);
app.mount('#app');

