import './register.css';

export default function Register() {
  return (
    <div id="register-content">
        <div id="register-container">
            <div id="register-form-header">
                <h1>Register</h1>
            </div>
            <div id="register-form-wrapper">
                <form id="register-form" action="/register">
                    <div id="register-info-wrapper">
                        <div id="register-email-wrapper">
                            <label>Email</label>
                            <input className="register-input" id="register-email-input" type="text"/>
                        </div>
                        <div id="register-username-wrapper">
                            <label>Username</label>
                            <input className="register-input" id="register-username-input" type="text"/>
                        </div>
                        <div id="register-password-wrapper">
                            <label>Password</label>
                            <input className="register-input" id="register-password-input" type="password"/>                        </div>
                    </div>
                    <div id="register-button-wrapper">
                        <button id="register-button">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}