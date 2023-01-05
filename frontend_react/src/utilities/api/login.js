import { post } from './api'

export default async function login()
{
    let user = await post('user/login');

    return user;
}