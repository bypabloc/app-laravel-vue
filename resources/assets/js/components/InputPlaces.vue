<template>
    <div>
        <label 
            :for="name"
            :class="[
                (visible ? '' : 'd-none'),
            ]">
            {{ label }}
        </label>
        <div 
            class="input-icon-container"
            :class="[
                (visible ? '' : 'd-none'),
            ]">
            
            <i
                v-if="icon"
                :class="[
                    (icon),
                    (inputValue?.length > 0 ? 'theme-color-primary-custom-500' : 'theme-color-disabled'),
                ]"
            ></i>
            <input 
                ref="autocomplete_address" 
                :name="name"
                :id="name"
                :type="type"
                :value="inputValue"
                :placeholder="placeholder"
                @input="handleChange"
                @blur="handleBlur"
                @change="onChange"
                @keyup="onChange"
                @keydown.enter.prevent
                :class="[
                    (
                        meta.valid ? 
                            (
                                (successMessage && 'is-valid ')
                                +
                                (errorMessage && 'is-invalid ')
                            ) 
                            : (errorMessage && 'is-invalid ')
                    ),
                ]">
        </div>
        <div 
            :class="[
                (
                    meta.valid ? 
                        (
                            (successMessage && 'valid-feedback ')
                            +
                            (errorMessage && 'invalid-feedback-custom-label ')
                        ) 
                        : (errorMessage && 'invalid-feedback-custom-label ')
                ),
            ]"
            v-show="errorMessage || meta.valid"
            >
            <span>
                {{ errorMessage ?? successMessage }}
            </span>
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

import { ref, onMounted, } from "vue";

export default {
    props: {
        type: {
            type: String,
            default: "text",
        },
        value: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        successMessage: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        errors: {
            type: Array,
            default: [],
        },
        icon: {
            type: String,
            default: null,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, ctx) {

        const {
            value: inputValue,
            errorMessage,
            handleBlur,
            handleChange,
            meta,
        } = useField(props.name, undefined, {
            initialValue: props.value,
        });

        const onChange = (event) => {
            const val = event.target.value;

            handleChange(val);
            ctx.emit("update:modelValue", val);
        };

        const autocomplete_address = ref(null);

        const MIX_GOOGLE_MAP_API_KEY = process.env.MIX_GOOGLE_MAP_API_KEY ?? '';

        const loadGoogleMaps = callback => {
            const existingScript = document.getElementById('googleMapsPlaces');
        
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${MIX_GOOGLE_MAP_API_KEY}&libraries=places`;
                script.id = 'googleMapsPlaces';
                script.async = true;
                document.body.appendChild(script);
            
                script.onload = () => {
                    console.log('onload')
                    if (callback) callback();
                };
            }
        
            if (existingScript && callback) callback();
        };

        onMounted(async () => {
        
            const { value:autocomplete_address_el } = autocomplete_address
            let autocomplete = null

            loadGoogleMaps(() => {
                autocomplete = new google.maps.places.Autocomplete(
                    (autocomplete_address_el),
                    {types: ['geocode']}
                );

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();

                    const { formatted_address } = place

                    ctx.emit("place_changed", place);

                    handleChange(formatted_address);
                    ctx.emit("update:modelValue", formatted_address);
                });
            });

        })

        return {
            onChange,
            handleChange,
            handleBlur,
            errorMessage,
            inputValue,
            meta,
            autocomplete_address,
        }
    },
}
</script>

<style scoped>

    .input-icon-container{
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
        font-weight: bold;
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
    .input-icon-container input {
        outline: none;
        border: none;
        background: none;
        font-size: 1em;
        padding: .5em;
        color: inherit;
        flex : auto 1 1;
        width : 100%;
        background : none;
        background-color : transperant;
    }
    .input > input:focus {
        /* #fef8fc */
        color: #212529;
        background-color: #fff;
        border-color: #fdb7e6;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(253, 183, 230, 0.25);
    }

    .theme-color-disabled{
        filter: invert(93%) sepia(6%) saturate(88%) hue-rotate(187deg) brightness(99%) contrast(87%);
    }

    input {
        font-family: 'Axiforma-Regular', sans-serif;
    }

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

    label {
        font-weight: bold;
    }

    .input-icon-container{
        /* Arriba | Derecha | Abajo | Izquierda */
        margin: 5px auto 15px auto;
    }
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #C4C4C4;
        opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #C4C4C4;
    }
    ::-ms-input-placeholder { /* Microsoft Edge */
        color: #C4C4C4;
    }
</style>