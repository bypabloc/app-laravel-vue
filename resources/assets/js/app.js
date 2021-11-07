import { createApp } from 'vue';

import "./sass/app.scss"
import "bootstrap"

import Index from  './views/Index.vue'

const APP_URL = process.env.APP_URL ?? 'APP_URL nada por aca';
console.log('APP_URL',APP_URL)

const MIX_TEST_1 = process.env.MIX_TEST_1 ?? 'MIX_TEST_1 nada por aca';
console.log('MIX_TEST_1',MIX_TEST_1)

const MIX_TEST_2 = process.env.MIX_TEST_2 ?? 'MIX_TEST_2 nada por aca';
console.log('MIX_TEST_2',MIX_TEST_2)

const MIX_TEST_3 = process.env.MIX_TEST_3 ?? 'MIX_TEST_3 nada por aca';
console.log('MIX_TEST_3',MIX_TEST_3)

const app = createApp({
    components: {
        Index,
    }
});

app.mount('#app');