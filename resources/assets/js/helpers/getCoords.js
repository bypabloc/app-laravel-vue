import { debug } from './getVars'

export default async () => {

    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    reject("El usuario denegó la solicitud de geolocalización.");
                break;
                case error.POSITION_UNAVAILABLE:
                    reject("La información de ubicación no está disponible.");
                break;
                case error.TIMEOUT:
                    reject("Se agotó el tiempo de espera de la solicitud para obtener la ubicación del usuario.");
                break;
                case error.UNKNOWN_ERROR:
                    reject("Un error desconocido ocurrió.");
                break;
            }
        });
    });
    if(debug()) console.log('pos',pos)
    
    return {
        accuracy: pos.coords.accuracy,
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
    };
}