export function sstore(key, value)
{
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function sget(key)
{
    return JSON.parse(sessionStorage.getItem(key));
}