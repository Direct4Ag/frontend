import axios, { AxiosError } from 'axios';

export const getData = <T>(endpoint: string, success: (data: T) => void, err?: (error: Error | AxiosError) => void) => {
    if (endpoint.startsWith("https://")){
        return axios
            .get(endpoint)
            .then(({ data }) => success(data))
            .catch((error) => {
                console.error(error);
                err?.(error);
            });
    }

    return axios
        .get(`${window.API_PATH}/${endpoint}`)
        .then(({ data }) => success(data))
        .catch((error) => {
            console.error(error);
            err?.(error);
        });
};

export const asyncGetData = async (endpoint: string) => {
    try {
        const response = await axios.get(endpoint.startsWith("https://") ? endpoint : `${window.API_PATH}/${endpoint}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}