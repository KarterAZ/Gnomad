import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import './login_button.css';

export function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: 'auth-code',
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
