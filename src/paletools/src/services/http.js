const BASE_URL = window.services.Authentication.sessionUtas.url;

export default function http(url, method, body){
    return fetch(`${BASE_URL}/ut/game/fifa22/${url}`, {
        method: method || 'GET',
        headers: {
            "X-UT-SID": services.Authentication.getUtasSession()["id"],
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null
    }).then(response => response.json());
}