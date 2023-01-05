import { get, post, isAuthenticated } from './api';

export default function createPin(pin)
{
    if (!isAuthenticated()) return null;

    const response = post('pins/create', pin);
    return response;
}