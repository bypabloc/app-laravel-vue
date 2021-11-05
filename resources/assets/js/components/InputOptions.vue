<template>

    <div class="col-12">
        <label 
            :class="[
                (type == 'radio' ? 'radio-custom' : 'checkbox-custom'),
                (errorMessage && 'invalid-feedback-custom')
            ]"
            v-for="(item, index) in items" :key="index">

            <label v-html="item.label"></label>

            <input 
                :type="type" 
                :name="name" 
                :value="item.value"
                @change="onChange"
                :id="name+'-'+index"
                :class="[
                    (
                        (errorMessage && ' invalid-feedback-polyfill')
                    ),
                ]"
                >
            <span></span>
        </label>

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
import { useField } from "vee-validate";

export default {
    props: {
        name: String,
        label: String,
        items: {
            type: Array,
            default: [],
        },
        type: {
            type: String,
            default: 'radio',
        },
        errors: {
            type: Array,
            default: [],
        },
    },
    setup(props, ctx) {
        
        const EMPTY_STRING = "";
        const {
            checked,
            handleChange,
            errorMessage,
            meta,
        } = useField(props.name, undefined, {
            validateOnMount: false,
            uncheckedValue: EMPTY_STRING,
            type: "radio",
            valueProp: props.value,
        });

        const onChange = (event) => {
            let val = event.target.value;

            if (!event.target.checked) {
                val = "";
            }

            if(val == 'true' || val == 'false'){
                val = val == 'true' ? true : false;
            }

            // val = !Number.isNaN(val) ? (Number.isInteger(val) ? parseInt(val) : parseFloat(val)) : '';

            handleChange(val);
            ctx.emit("update:modelValue", val);
        };

        return {
            checked,
            onChange,
            errorMessage,
            meta,
        };
    },
};
</script>

<style scoped>
    .invalid-feedback-custom-label {
        width: 100%;
        margin-top: .25rem;
        font-size: 80%;
        color: #dc3545;
    }

    .invalid-feedback-custom {
        width: 100%;
        margin-top: .25rem;
        /* font-size: 80%; */
        color: #dc3545;
    }

    .checkbox-custom {
        font-family: 'Axiforma-Medium', sans-serif;
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border-radius: 25%;
    }

    /* The container */
    .radio-custom {
        font-family: 'Axiforma-Medium', sans-serif;
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Create a custom checkbox */
    .checkbox-custom span {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #E7E7EE;
        border-radius: 25%;
    }

    /* Create a custom radio button */
    .radio-custom span {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #E7E7EE;
        border-radius: 50%;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkbox-custom span:after {
        content: "";
        position: absolute;
        display: none;
    }
    .radio-custom span:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Style the checkmark/indicator */
    .checkbox-custom span:after {
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    /* Style the indicator (dot/circle) */
    .radio-custom span:after {
        top: 9px;
        left: 9px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
    }

    /* Hide the browser's default checkbox */
    .checkbox-custom input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* On mouse-over, add a grey background color */
    .checkbox-custom:hover input[type="checkbox"] ~ span {
        background-color: #E7E7EE;
        border-radius: 25%;
    }

    /* When the checkbox is checked, add a blue background */
    .checkbox-custom input[type="checkbox"]:checked ~ span {
        background-color: #FF18A6;
        border-radius: 25%;
    }

    /* Show the checkmark when checked */
    .checkbox-custom input[type="checkbox"]:checked ~ span:after {
        display: block;
    }

    /* Hide the browser's default radio button */
    .radio-custom input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    /* On mouse-over, add a grey background color */
    .radio-custom:hover input[type="radio"] ~ span {
        background-color: #E7E7EE;
        border-radius: 25%;
    }

    /* When the radio button is checked, add a blue background */
    .radio-custom input[type="radio"]:checked ~ span {
        background-color: #FF18A6;
        border-radius: 25%;
    }

    /* Show the indicator (dot/circle) when checked */
    .radio-custom input[type="radio"]:checked ~ span:after {
        display: block;
    }
</style>