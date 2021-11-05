<template>
    <i v-html="icono"></i>
</template>

<script>

import icons from './icons'

export default {
    name: 'Icons',
    props: {
        icon: { 
            type: String,
            // required: true,
            default: 'bag',
        },
        stroke: { 
            type: String,
            default: '#ff18a6',
        },
        fill: { 
            type: String,
            default: '#ff18a6',
        },
        width: { 
            type: [String, Number],
            default: '24',
        },
        height: {
            type: [String, Number],
            default: '24',
        },
        fill_opacity: {
            type: String,
            default: '1',
        },
    },
    setup: (props) => {

        const { icon,width,height,color,stroke,fill,fill_opacity, } = props
    
        const icono = icons[icon] ? icons[icon]({ width,height,color,stroke,fill,fill_opacity, }) : icons['bag']({ width,height,color,stroke,fill,fill_opacity, })

        return {
            icono,
        };
    },
}
</script>