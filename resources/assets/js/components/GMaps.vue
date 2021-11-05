<template>
    <div>
        <div ref="map_el" style="width: 100%; height: 300px;"></div>
        <label 
            :for="name"
            :class="[
                (visible ? '' : 'd-none'),
            ]">
            {{ label }}
        </label>
        <div
            class="input-icon-container"
            >
            <div class="input-group mb-3"
                :class="[
                    (visible ? '' : 'd-none'),
                ]">
                <button class="btn btn-left" type="button">
                    <a
                        href="#"
                        :class="[
                            (icon),
                            (inputValue?.length > 0 ? 'theme-color-pink-custom-500' : 'theme-color-disabled'),
                        ]"
                    />
                </button>
                
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
                    class="form-control"
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

                <button class="btn btn-right" type="button" @click="getLocation">
                    <a
                        href="#"
                        class="gm-icons-v2 gm-icons-v2-location-pin gm-icons-v2-x18"
                        :class="[
                            (inputValue?.length > 0 ? 'theme-color-pink-custom-500' : 'theme-color-disabled'),
                        ]"
                    />
                </button>
            </div>
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

import { ref, onBeforeMount, onMounted, } from "vue";

import { Loader } from "@googlemaps/js-api-loader"

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
        location: {
            type: Object,
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
        const map_el = ref(null);

        const MIX_GOOGLE_MAP_API_KEY = process.env.MIX_GOOGLE_MAP_API_KEY ?? '';

        const loadMap = async () => {
            const loader = new Loader({
                apiKey: MIX_GOOGLE_MAP_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });
            return await loader.load();
        }

        let google = null

        let map = null
        let markers = [];

        let autocomplete = null

        onBeforeMount(async () => {
            try {
                google = await loadMap();

                const mapOptions = {
                    center: {
                        lat: -12.0463731,
                        lng: -77.042754,
                    },
                    zoom: 4,
                };

                const { value:map_el_value } = map_el
                const { value:autocomplete_address_el } = autocomplete_address

                map = new google.maps.Map(map_el_value, mapOptions);

                google.maps.event.addListener(map, 'click', async (event) => {
                    const { latLng: position } = event

                    setMarker({
                        coords: {
                            latitude: position.lat(),
                            longitude: position.lng(),
                        },
                    })

                    const address = await getAddressFromCoords({
                        coords: {
                            latitude: position.lat(),
                            longitude: position.lng(),
                        },
                    })

                    setAddressFromCoords(address)
                });

                autocomplete = new google.maps.places.Autocomplete(
                    (autocomplete_address_el),
                    {types: ['geocode']}
                );

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();

                    const { formatted_address, name } = place
                    if(formatted_address){
                        const { lat, lng } = place.geometry.location

                        setAddressFromCoords(place)

                        setMarker({
                            coords: {
                                latitude: lat(),
                                longitude: lng(),
                            },
                        })
            
                        map.setZoom(18);

                    }else{
                        handleChange(name);
                        ctx.emit("update:modelValue", name);
                    }

                });
            
                console.log('onBeforeMount')

                console.log('props',props)
                console.log('props.location',props.location)

                if(props.location){
                    const { lat, lng } = props.location
                    setMarker({
                        coords: {
                            latitude: parseFloat(lat),
                            longitude: parseFloat(lng),
                        },
                    })
            
                    map.setZoom(18);
                }else{
                    getLocation()
                }

            } catch (err) {
                console.error(err);
            }
        });

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition,showErrorPosition);
            } else {
                console.error("Este navegador no admite la geolocalización.")
            }
        };

        const setAddressFromCoords = (address) => {
            ctx.emit("place_changed", address);

            handleChange(address.formatted_address);
            ctx.emit("update:modelValue", address.formatted_address);
        };

        const getAddressFromCoords = async ({coords}) => {
            const position = {
                lat: coords.latitude,
                lng: coords.longitude,
            }

            const latlng = new google.maps.LatLng(position.lat, position.lng);

            const geocoder = new google.maps.Geocoder();

            try {
                const { results } = await geocoder.geocode({ 'latLng': latlng })
                console.log('results',results)
                return results[0]
            } catch (err) {
                console.error(err)
            }
        }

        const setPosition = async ({coords}) => {
            setMarker({coords})
            
            map.setZoom(18);

            const address = await getAddressFromCoords({coords})
            setAddressFromCoords(address)
        };

        const setMarker = ({coords}) => {

            console.log('setMarker',{coords})
            
            const position = {
                lat: coords.latitude,
                lng: coords.longitude,
            }

            map.setCenter(position);

            const marker_new = new google.maps.Marker({
                position, 
                map,
            });
            if (markers) {
                for (const marker of markers) {
                    marker.setMap(null);
                }
                markers.length = 0;
            }
            markers.push(marker_new);
        };

        const showErrorPosition = (error) => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error("El usuario denegó la solicitud de geolocalización.");
                break;
                case error.POSITION_UNAVAILABLE:
                    console.error("La información de ubicación no está disponible.");
                break;
                case error.TIMEOUT:
                    console.error("Se agotó el tiempo de espera de la solicitud para obtener la ubicación del usuario.");
                break;
                case error.UNKNOWN_ERROR:
                    console.error("Un error desconocido ocurrió.");
                break;
            }
        }

        return {
            onChange,
            handleChange,
            handleBlur,
            errorMessage,
            inputValue,
            meta,
            map_el,
            autocomplete_address,
            getLocation,
        }
    },
}
</script>

<style scoped>

    .input-group {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        align-items: stretch;
        width: 100%;
    }
    
    .btn-left {
        border: 1px solid transparent;
    }
    .btn-left:focus {
        outline: 0;
        box-shadow: none; 
    }

    .form-control {
        border: 1px solid transparent;
    }
    .form-control:focus {
        box-shadow: none;
    }

    .btn-right {
        border: 1px solid transparent;
    }

    .input-icon-container {
        display: flex;
        flex-direction: row;
        background: #fff;
        align-items: flex-start;
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
        justify-content: center;
        flex-wrap: nowrap;
        align-content: center;
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