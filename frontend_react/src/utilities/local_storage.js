export function lstore(key, value)
{
    localStorage.setItem(key, JSON.stringify(value));
}

export function lget(key)
{
    return JSON.parse(localStorage.getItem(key));
}