import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./style.css";

export default function Auth() {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  function addEmailToURL() {
    let lang = document.documentElement.lang;
    navigate(`/${lang === "en" ? "en" : "ru"}/main`);
    // Get the user's email from the input field
    // var userEmail = document.querySelector(".email_input").value;

    // Modify the form action to include the email as a URL parameter
    // document.getElementById("loginForm").action =
    // "./ac-comp-ru.html?email=" + encodeURIComponent(userEmail);
  }

  return (
    <>
      {tab == 1 ? (
        <form
          className="login_form"
          // action="./en/main"
          id="loginForm"
          onSubmit={addEmailToURL}
        >
          <div id="logo_wrapper" className="logo_wrapper">
            <img className="logo" src={require("./logo.png")} alt="logo" />
          </div>

          <div className="fields">
            <input
              className="email_input"
              type="email"
              placeholder="Электронная почта"
              name="email"
              required
            />
            <input
              className="psw_input"
              type="password"
              placeholder="Пароль"
              name="psw"
              required
            />
          </div>

          <button className="button" type="submit">
            Войти
          </button>

          <div className="signup_wrapper">
            <p className="sign_up">Нет аккаунта?</p>
            <a className="sign_up_link" onClick={() => setTab(2)}>
              Зарегистрироваться
            </a>
          </div>
        </form>
      ) : (
        <form class="signup_form" action="#">
          <div id="signup_logo_wrapper" class="logo_wrapper">
            <img class="signup_logo" src={require("./logo.png")} alt="logo" />
            <h3 class="signup_title">Регистрация</h3>
          </div>

          <div class="fields">
            <input
              class="name_input"
              type="text"
              placeholder="Имя"
              name="name"
              required
            />

            <input
              class="email_input"
              type="email"
              placeholder="Электронная почта"
              name="email"
              required
            />

            <input
              class="psw_input"
              type="password"
              placeholder="Пароль"
              name="psw"
              required
            />

            <input
              class="psw_input"
              type="password"
              placeholder="Повторите пароль"
              name="psw"
              required
            />
          </div>

          <button class="button" type="submit">
            Зарегистрироваться
          </button>

          <div class="login_wrapper">
            <p class="login">Есть аккаунт?</p>
            <a class="login_link" onClick={() => setTab(1)}>
              Войти
            </a>
          </div>
        </form>
      )}
    </>
  );
}
