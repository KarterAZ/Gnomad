import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { setCookie } from '../../cookies';
import './login_button.css';

window.SaveAccessToken = (response) => {
  console.log(response);
  setCookie('id_token', response.credential);
}

export function LoginButton() {
  return (
    <>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div id="g_id_onload"
          data-client_id="55413052184-k25ip3n0vl3uf641htstqn71pg9p01fl.apps.googleusercontent.com"
          data-callback="SaveAccessToken">
      </div>
      <div className="g_id_signin" data-type="standard"></div>
    </>
  );
}

export function LogoutButton() {
  return (
    <button className='user-button' onClick={googleLogout()}>
      Logout
    </button>
  );
}
