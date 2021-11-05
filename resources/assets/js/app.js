import { createApp } from 'vue';

import "./sass/app.scss"
import "bootstrap"

import Index from  './views/Index.vue'

const app = createApp({
    components: {
        Index,
    }
});

app.mount('#app');