
export async function post(url: string, data: any) {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${id}----${token}`
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return { status: response.status, json: await response.json() };
}

export async function get(url: string) {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${id}----${token}`,
            'Content-Type': 'application/json'
        }
    });

    return { status: response.status, json: await response.json() };
}

export function serverUrlFrom(url: string, withProtocol: boolean): string {

    let serverURL = url;

    if (withProtocol) {
        if (!url.includes('http://') && !url.includes('https://')) {
            serverURL = 'http://' + url;
        }
    } else {
        if (url.includes('http://')) {
            serverURL = url.split('http://')[1];
        } else if (url.includes('https://')) {
            serverURL = url.split('https://')[1];
        }
    }


    return serverURL;
}