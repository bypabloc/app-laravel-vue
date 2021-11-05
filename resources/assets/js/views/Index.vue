<template>
    <h2> Filter LearnVue Articles </h2>
    <input 
        type='text' 
        placeholder='Filter Search' 
        v-model='query'
    />
    <button @click='reset'> Reset </button>
    <br/>
    {{ query }}
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    name: 'HelloWorld',
    setup () {

        onMounted(() => {
            console.log('mounted')
        })

        const query = ref('')

        const reset = (evt) => {
            query.value = '' // clears the query
        }

        return {
            query,
            reset,
        }
    }
}
</script>