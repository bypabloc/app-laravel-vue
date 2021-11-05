import { debug } from './getVars'
import getCoords from './getCoords'

export default async () => {

    let coords = null;
    try {
        coords = await getCoords();
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
        })
        return;
    }

    const deviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };

    return {
        timezone: (new Date()).getTimezoneOffset()/60,

        previous_sites: history?.length ? history?.length : 0,

        browser_name: navigator?.userAgentData?.brands?.[0]?.brand ? navigator.userAgentData.brands[0].brand : navigator?.appName,
        browser_engine: navigator?.userAgentData?.brands?.[1]?.brand ? navigator.userAgentData.brands[1].brand : navigator?.product,
        browser_version: navigator?.userAgentData?.brands?.[0]?.version ? navigator.userAgentData.brands[0].version : navigator.appVersion,
        browser_version_agent: navigator?.userAgent,
        browser_language: navigator?.language,

        platform: navigator?.userAgentData?.platform ? navigator.userAgentData.platform : navigator.platform,

        device_type: deviceType(),

        size_screen_width: screen?.width,
        size_screen_height: screen?.height,

        coords_accuracy: coords?.accuracy,
        coords_lat: coords?.lat,
        coords_lng: coords?.lng,
    }
}