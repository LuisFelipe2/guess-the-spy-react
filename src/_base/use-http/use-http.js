import { useAxios } from "../"

export function useHttp(
    baseURL,
    headers,
    onError = function (e) {
        throw e
    }
) {
    const instanceAxios = useAxios(baseURL, headers)

    async function get(url) {
        const response = await instanceAxios.get(url).catch(onError)
        return response.data
    }

    async function deletar(url, body) {
        const response = await instanceAxios.delete(url, body).catch(onError)
        return response.data
    }

    async function post(url, body) {
        const response = await instanceAxios.post(url, body).catch(onError)
        return response.data
    }

    return {
        get,
        post,
        deletar,
    }
}
