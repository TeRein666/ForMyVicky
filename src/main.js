import { createApp } from "vue";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

//import App from './important/App.vue';
//import App from "./important/use1.vue";
//import { createPinia } from 'pinia';
//import router from './important/router.js';

// import App from './Catwebsite/app1.vue'
// import router from './Catwebsite/router1.js';

import App from './ForMyVicky/MainPage.vue'
//import router from './ForMyVicky/router1.js';

const  app=createApp(App);
//app.use(router);
app.mount("#app");
//app.use(createPinia())


