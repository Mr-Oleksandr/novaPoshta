import axios from 'axios'
export const novaPoshtaURL = 'https://api.novaposhta.ua/v2.0/json/';
export const novaPoshtaAPIKEY = '28cbadab6e99ec80267afee18954a73e';

const novaPoshtaAPI = axios.create({
    baseURL: novaPoshtaURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

novaPoshtaAPI.interceptors.request.use(
    (resp) => {
        if (resp.method === 'post' || resp.method === 'POST') {
            const modifiedParams = { ...resp };

            modifiedParams.data.apiKey = novaPoshtaAPIKEY;

            return modifiedParams;
        }

        return resp;
    },
    (error) => Promise.reject(error),
);
export { novaPoshtaAPI };
