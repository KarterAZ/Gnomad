import { get, isAuthenticated} from './api';

export default function getPins()
{
    if (!isAuthenticated()) return null;

    const response = get('user/pins');

    return response;
}