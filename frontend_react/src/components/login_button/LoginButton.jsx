import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { setCookie } from '../../cookies';
import './login_button.css';

function SaveAccessToken(response) {
  setCookie('access_token', response.access_token);
}

export function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => SaveAccessToken(codeResponse),
  });

  return (
    <button className='user-button' onClick={() => login()}>
      Login
    </button>
  );
}

export function LogoutButton() {
  return (
    <button className='user-button' onClick={googleLogout()}>
      Logout
    </button>
  );
}
