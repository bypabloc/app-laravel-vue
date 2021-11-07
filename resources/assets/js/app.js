import { createApp } from 'vue';

import "./sass/app.scss"
import "bootstrap"

import Index from  './views/Index.vue'

const MIX_TEST_1 = process.env.MIX_TEST_1 ?? 'MIX_TEST_1 nada por aca';
const MIX_TEST_2 = process.env.MIX_TEST_2 ?? 'MIX_TEST_2 nada por aca';

console.log('MIX_TEST_1',MIX_TEST_1)
console.log('MIX_TEST_2',MIX_TEST_2)

const app = createApp({
    components: {
        Index,
    }
});

app.mount('#app');