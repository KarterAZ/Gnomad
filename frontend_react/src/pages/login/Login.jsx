import './login.css';

export default function Login() {
  return (
    <div id="login-content">
        <div id="login-container">
            <div id="login-form-header">
                <h1>Login</h1>
            </div>
            <div id="login-form-wrapper">
                <form id="login-form" action="/">
                    <div id="login-info-wrapper">
                        <div id="login-username-wrapper">
                            <label>Username</label>
                            <input className="login-input" id="login-username-input" type="text"/>
                        </div>
                        <div id="login-password-wrapper">
                            <label>Password</label>
                            <input className="login-input" id="login-password-input" type="password"/>                        </div>
                    </div>
                    <div id="login-button-wrapper">
                        <button id="login-button">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}