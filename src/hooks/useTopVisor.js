import {useState} from 'react';
import {topVisor} from "../utils/apiKey";

export const useTopVisor = (settings) => {
    const [isLoading, setIsLoading] = useState(false);
    //const hostName = 'https://api.topvisor.com/v2/json';
    const hostName = 'https://topvisor-proxy.mayabiorobotics.ru/top-visor/proxy';

    const fetching = async (dt) => {
        let resp = '';
        let headers = {
            'Content-Type': 'application/json',
            //"User-Id": topVisor.userId,
           // Authorization: 'bearer ' + topVisor.apiKey
            redirectUrl: "https://api.topvisor.com/v2/json" + settings.url
        }
        if (!isLoading) setIsLoading(true);
        if (dt) {
            Object.assign(settings.data, dt)
        }
        try {
            const response = await fetch(hostName, {
                crossDomain: true,
                method: settings.method || 'POST',
                body: settings.data && JSON.stringify(settings.data),
                headers: settings.headers ? Object.assign(headers, settings.headers) : headers
            });
            resp = await response.json();
            if (!response.ok) {
                setIsLoading(false);
                if (resp.error.description) {
                    throw new Error(resp.error.description);
                } else {
                    throw new Error(resp.error.message);
                }
            }
        } catch (e) {
            setIsLoading(false);
            if (e.message === 'Failed to fetch') {
                throw new Error('Нет соединения с сервером')
            } else {
                throw new Error(e.message)
            }
        }
        setIsLoading(false);
        return resp;
    }

    return [fetching, isLoading];
}
