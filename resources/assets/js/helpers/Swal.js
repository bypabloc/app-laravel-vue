import Swal from 'sweetalert2'

export default ({
    title = '',
    text = '',
    type = 3,
    input = false,
    confirm = false,
    preConfirm = false,
    toExec = false,
}={
    title: '',
    text: '',
    type: 3,
    input: false,
    confirm: false,
    preConfirm: false,
    toExec: false,
}) => {
    
    const object = {
        showClass: {
            popup: 'animate__animated animate__bounceIn',
        },
        hideClass: {
            popup: 'animate__animated animate__bounceOut',
        },
    }

    if(toExec){
        object['willClose'] = () => toExec();
    }

    if(confirm){
        object['showCloseButton'] = true;
        object['showCancelButton'] = true;
        object['focusConfirm'] = true;
        object['confirmButtonText'] = 'Confirmar';
        object['cancelButtonText'] = 'Cancelar';
        delete object['willClose'];
    }

    if(preConfirm){
        object['preConfirm'] = (e) => preConfirm(e);
        object['allowOutsideClick'] = () => !Swal.isLoading();
        delete object['willClose'];
    }

    if(input){
        // Expecte "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url"
        object['input'] = input?.type;
        switch (input?.type) {
            case 'input':
                object['inputPlaceholder'] = 'Indique un motivo';
                object['inputAutoTrim'] = true;
                object['inputAttributes'] = {
                    minlength: 5,
                    autocapitalize: 'off',
                    autocorrect: 'off',
                };
                break;

            case 'select':
                object['inputOptions'] = input?.options;
                object['inputPlaceholder'] = 'Seleccione un item...';
                object['didOpen'] = () => {};
                break;

            case 'textarea':
                object['inputPlaceholder'] = 'Indique un motivo';
                object['inputAutoTrim'] = true;
                object['inputAttributes'] = {
                    minlength: 5,
                    autocapitalize: 'off',
                    autocorrect: 'off',
                };
                break;
        
            default:
                break;
        }
        object['inputAttributes'] = {
            autocapitalize: 'off'
        };
        object['showLoaderOnConfirm'] = true;
        object['inputValidator'] = (value) => {
            if (!value) {
                let result = '';
                switch (input?.type) {
                    case 'input':
                        result = 'Debe indicar un motivo';
                        break;
        
                    case 'select':
                        result = 'Debe seleccionar un item';
                        break;
        
                    case 'textarea':
                        result = 'Debe indicar un motivo';
                        break;
                
                    default:
                        result = '';
                        break;
                }
                return result
            }else if (value == input?.value) {
                let result = '';
                switch (input?.type) {
                    case 'input':
                        result = 'Debe indicar un motivo diferente';
                        break;
        
                    case 'select':
                        result = 'Debe seleccionar un item diferente';
                        break;
        
                    case 'textarea':
                        result = 'Debe indicar un motivo diferente';
                        break;
                
                    default:
                        result = '';
                        break;
                }
                return result
            }
        };

        object['inputValue'] = input?.value ? input.value : '';

    }

    /*
    if(buttons){
        object['showCloseButton'] = true;
        object['showCancelButton'] = false;
        object['showConfirmButton'] = false;
    }
    */

    switch (type) {
        case 1:
            object['icon'] = 'info';
            object['title'] = `<strong>${title}</strong>` || '<strong>Información</strong>';
            break;

        case 2:
            object['icon'] = 'warning';
            object['title'] = `<strong>${title}</strong>` || '<strong>Advertencia</strong>';
            break;

        case 3:
            object['icon'] = 'error';
            object['title'] = `<strong>${title}</strong>` || '<strong>Error</strong>';
            break;

        case 4:
            object['icon'] = 'success';
            object['title'] = `<strong>${title}</strong>` || '<strong>Exitosamente</strong>';
            break;
        
        default:
            break;
    }

    const typeof_el = typeof text;
    if(typeof_el === 'object'){
        object['html'] = text;
    }else if(typeof_el === 'string'){
        if(text?.trim()?.length > 0){
            object['html'] = text;
        }else{
            object['html'] = '';
        }
    }

    const sawl = Swal.fire(object)
        sawl.then((result) => {
            if (result.isConfirmed) {
                if(toExec){
                    toExec(result)
                }
            }
        })
};