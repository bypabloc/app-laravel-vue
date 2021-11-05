import axios from 'axios'

// const baseURL = 'https://api.ipify.org/?format=json';
const baseURL = 'https://checkip.amazonaws.com/';

const headers = {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json',
};

export default async () => {
    const instance = axios.create({
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache', 
        baseURL,
        headers,
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
    });
    
    return await instance.get('')
}