import axios from "axios"

export function useAxios(baseURL, headers) {
    return axios.create({
        baseURL,
        headers,
    })
}
