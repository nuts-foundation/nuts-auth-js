# @nuts-foundation/auth

[![npm (scoped)](https://img.shields.io/npm/v/@nuts-foundation/auth)](https://www.npmjs.com/package/@nuts-foundation/auth)

> :warning: **This repository is no longer maintained. Use the packages provided by the Privacy By Design Foundation: https://github.com/privacybydesign.**

An easy to use client js library to authenticate a user with nuts-auth.

The library helps you with the following:

* Connections to the nuts-node
* Creating login sessions
* Polling for IRMA session status
* Updating the UI on session changes
* Forwarding the user to specific location after successful login
* Gracefully handling browser reload during login sessions

## Install

```
$ npm add @nuts-foundation/auth
```

## Style guide

Combine it with the NUTS style guide and get the frontend for free!

https://github.com/nuts-foundation/irma-web-frontend

## Usage

```html
<!--The nuts auth styleguide -->
<link rel="stylesheet" href="//nuts-foundation.github.io/irma-web-frontend/application.css" />
<!--The nuts auth js lib. Note: include path depends on your dev stack-->
<script src="/node_modules/@nuts-foundation/auth/dist/index.min.js"></script>

<section class="nuts-login-form irma-web-form">
  <header class="header">
    <p>Login with <i class="irma-web-logo">IRMA</i></p>
    <section class="helper">
      <p>Don't know what to do here? Take a look at the <a href="https://privacybydesign.foundation/irma-begin/">de
          website of IRMA</a>.</p>
    </section>
  </header>
  <section class="content">
    <section class="centered loading">
      <div class="irma-web-loading-animation"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <p>One moment please...</p>
    </section>
    <section class="centered initialized">
      <canvas id="qrcode"></canvas>
    </section>
    <section class="centered waiting-for-user">
      <div class="irma-web-waiting-for-user-animation"></div>
      <p>Follow the instructions on your phone</p>
    </section>
    <section class="centered success">
      <div class="irma-web-checkmark-animation"></div>
      <p>Success!</p>
    </section>
    <section class="centered expired">
      <p>The transaction took long</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
    <section class="centered cancelled">
      <p>The transaction got cancelled</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
    <section class="centered errored">
      <p>Something went wrong</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
  </section>
</section>
```

```js
nutsLogin = nutsAuth.init({
    nutsAuthUrl: "http://localhost:1323",
    qrEl: 'qrcode',
    logLevel: 'debug',
    postTokenPath: '/login',
    afterSuccessPath: '/user'
  })
nutsLogin.start();
````
