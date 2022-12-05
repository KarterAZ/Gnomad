import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import './login_button.css';

export function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: 'auth-code',
  });

  const GoogleAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const onSuccess = async (res: any) => {
      try {
        const result: AxiosResponse<AuthResponse> = await axios.post("/auth/", {
          token: res?.tokenId,
        });
  
        setUser(result.data.user);
      } catch (err) {
        console.log(err);
      }
    };

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
