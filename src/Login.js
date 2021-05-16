import React from 'react';

const Login = (props) => {

    const {
        email,
        setEmail,
        password,
        setPassword,
        handleSignup,
        handleLogin,
        hasAccount,
        emailError,
        passwordError,
        setHasAccount } = props;

    return (
        <section className="login">
            <div className="loginContainer">
                <label>Username</label>

                <input
                    type="text"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className="errorMsg">{emailError}</p>
                <label>password</label>
                <input
                    type="password"
                    autoFocus
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className="errorMsg">{passwordError}</p>
                <div className="btnContainer">
                    {hasAccount ? (
                        <>
                            <button onClick={handleSignup}>Sign up</button>
                            <p>Have an Accout  <span onClick={() => setHasAccount(!hasAccount)}>Login</span></p>
                        </>

                    ) : (
                        <div>
                            <button onClick={handleLogin}>Login</button>
                            <p>Don't have an Accout  <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span></p>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
};

export default Login;