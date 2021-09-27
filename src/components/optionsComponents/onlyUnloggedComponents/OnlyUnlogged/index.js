import React from 'react';

const OnlyUnlogged = () => {
    return (
        <>
            <p id="unloggedMessage"><a href="https://app.pavlok.com/users/sign_up">Create an
                account</a> or sign in</p>
            <input placeholder="Email Address" id="pavUserNameLogin" type="text" class="loginInput"
                alt="Your email" /><br />
            <input placeholder="Password" id="pavPasswordLogin" type="password" class="loginInput"
                alt="Your password" /><br />
            <input id="pavSubmitLogin" type="button" value="Sign In" class="loginInput clickable"
                alt="Submit" /><br />
            <p><a href="http://app.pavlok.com/users/password/new" target="blank">Forgot your
                password?</a></p>
        </>
    );
}

export default OnlyUnlogged;