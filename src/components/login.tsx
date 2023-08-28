import React from 'react';
import './login-style.css';

const Login: React.FC = () => {
  const handleLoginHeaderClick = () => {
    const wrapper = document.querySelector(".wrapper");
    if (wrapper) {
      wrapper.classList.add("active");
    }
  };

  const handleSignupHeaderClick = () => {
    const wrapper = document.querySelector(".wrapper");
    if (wrapper) {
      wrapper.classList.remove("active");
    }
  };

  return (
    <div>
      <section className="wrapper">
        <div className="form signup">
          <header onClick={handleSignupHeaderClick}>Регистрация</header>
          <form action="#">
            <input type="text" placeholder="Полное имя" required />
            <input type="text" placeholder="Email или телефон" required />
            <input type="password" placeholder="Пароль" required />
            <div className="checkbox">
              <input type="checkbox" id="signupCheck" />
              <label htmlFor="signupCheck">Я принимаю условия компании</label>
            </div>
            <input type="submit" value="Регистрация" />
          </form>
        </div>

        <div className="form login">
          <header onClick={handleLoginHeaderClick}>Войти</header>
          <form action="http://127.0.0.1:5500/src/components/index.html">
            <input id="email" type="text" placeholder="Email или телефон" required />
            <input id="pass" type="password" placeholder="Пароль" required />
            <a href="#">Забыли пароль?</a>
            <input type="submit" value="Войти" />
          </form>
        </div>
      </section>
      <script src='script.jsx'></script>
    </div>
  );
};

export default Login;
