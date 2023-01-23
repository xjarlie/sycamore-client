
export async function post(url: string, data: any) {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id');

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
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id');

    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${id}----${token}`,
            'Content-Type': 'application/json'
        }
    });

    return { status: response.status, json: await response.json() };
}