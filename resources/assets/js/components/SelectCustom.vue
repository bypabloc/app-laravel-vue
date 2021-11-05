<template>
    <div class="col-12">
        <label :for="name">{{ label }}</label>
        <v-select
            :options="items"
            placeholder=""
            label="text"
            @select="onChange"
            @input="onChange"
            select-label=""
            class="select"
            :disabled="disabled"
            :searchable="true" 
            >
            <template v-slot:noResult>
                No se encontraron elementos.
            </template>
            <template v-slot:selection="props">
                <!-- {{ props }} -->
                <div style="
                    display: flex;
                    align-items: center;
                    flex-direction: row;"
                    >
                    <span v-if="valueChanged?.text?.length > 0">
                        <i v-if="valueChanged?.icon" :class="valueChanged.icon"></i>
                        <span v-if="valueChanged.icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{{ valueChanged.text }}</span>
                    </span>
                    <span v-else>
                        <span>{{ placeholder }}</span>
                    </span>
                </div>
            </template>
            <template v-slot:option="{ option }">
                <div style="
                    display: flex;
                    align-items: center;
                    flex-direction: row;"
                    >
                    <i
                        v-if="option.icon"
                        :class="[
                            (option.icon),
                        ]"
                    ></i>
                    <span v-if="option.icon">&nbsp;&nbsp;</span>
                    <span>{{ option.text }}</span>
                </div>
                
            </template>
        </v-select>

        <div 
            class="invalid-feedback-custom-label"
            v-show="errorMessage"
            >
            {{ errorMessage }}
        </div>
        <div 
            :class="[
                (
                    errors.length ? 'invalid-feedback-custom-label ' : ''
                ),
            ]"
            v-show="errors.length"
            >
            <span v-for="(item, index) in errors" :key="index" :value="item">
                {{ item }}
            </span>
        </div>
    </div>
</template>

<script>

import { ref, } from 'vue'
import { useField } from "vee-validate";
// import VueNextSelect from 'vue-next-select'
import Multiselect from 'vue-multiselect'

// import 'vue-next-select/dist/index.min.css';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
    components: {
        'v-select': Multiselect,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            default: "Elija...",
        },
        items: {
            type: Array,
            default: [],
        },
        value: {
            type: String,
            default: "",
        },
        loading: {
            type: Boolean,
            default: false,
        },
        errors: {
            type: Array,
            default: [],
        },
        selected: {
            type: String,
            default: 'Chile',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: null,
        },
    },
    setup(props, ctx) {

        const { value: inputValue, handleChange, errorMessage } = useField(
            props.name,
            undefined,
            {
                initialValue: props.value,
            },
        );

        const valueChanged = ref(props.value ? props.items.find(e => e.value == props.value) : {}) 

        const onChange = (e) => {
            const { value, text, } = e
            valueChanged.value = e
            handleChange(value);
            ctx.emit("update:modelValue", value);
        };

        return {
            onChange,
            errorMessage,
            inputValue,
            valueChanged,
        };
    },
};
</script>

<style>
    .multiselect__tags{
        /* color: #35495e; */
        display: flex;
        flex-direction: row;
        background : #fff;
        align-items : center;
        overflow: hidden;

        width: 100%;
        padding: 1rem;
        font-size: 0.9rem;
        font-weight: 400;
        line-height: 1.6;
        /* color: #a7a8aa; */
        /* font-weight: bold; */
        border: 1px solid #fef8fc;
        border-radius: 1rem;
        height: 64px;
        appearance: none;
        /* box-shadow: 0 0 0 0.25rem rgba(196, 196, 196, 0.251); */
        filter: drop-shadow(10px 10px 10px rgba(196, 196, 196, 0.251));
        -webkit-appearance: none;
        -moz-appearance: none;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
</style>

<style scoped>

    div{
        font-family: 'Axiforma-Regular', sans-serif;
    }

    .invalid-feedback-custom-label {
        width: 100%;
        margin-top: 0.25rem;
        font-size: 80%;
        color: #dc3545;
    }

    .invalid-feedback-custom {
        width: 100%;
        margin-top: 0.25rem;
        /* font-size: 80%; */
        color: #dc3545;
    }

    label {
        font-weight: bold;
    }

    .input{
        /* Arriba | Derecha | Abajo | Izquierda */
        margin: 5px auto 10px auto;
    }
    .input > select {
        display: block;
        width: 100%;
        padding: 1rem;
        font-size: 0.9rem;
        font-weight: 400;
        line-height: 1.6;
        color: #a7a8aa;
        font-weight: bold;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #fef8fc;
        border-radius: 1rem;
        height: 64px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        box-shadow: 0 0 0 0.25rem rgba(196, 196, 196, 0.251);
    }
    .input > select:focus {
        /* #fef8fc */
        color: #212529;
        background-color: #fff;
        border-color: #fdb7e6;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(253, 183, 230, 0.25);
    }
</style>