import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/auth";
import Home from "./components/Home";
import {
  Link,
  Route,
  Routes,
  BrowserRouter as Router,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// import "./components/login-reg.css";
// import "./components/login-stylHomee.css";
// import "./components/main-style.css";
// import "./components/test2.css";
// import "./components/test3.css";
// import "./components/single-widget.css";
// import "./index.css";
// import "./components/chart-tabs"; // Import the script
// import "./components/side-main.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import bootstrap from "bootstrap";
import "highcharts/css/stocktools/gui.css";
import "highcharts/css/annotations/popup.css";
import "./components/style.css";

import blurImg from "./assets/images/blur-dark.png";

const App = () => {
  const [isLogin, setIsLogin] = useState(() =>
    localStorage.getItem("USER") ? true : false
  );
  // return (
  //   <Router>
  //     <Routes>login
  //       <Route path="/login" Component={Login} index />
  //       <Route path="/main" /*Component={}*/ />
  //     </Routes>
  //   </Router>
  // );

  useEffect(() => {
    const root = document.getElementById("root");
    if (isLogin) {
      root.removeAttribute("style");
      return;
    }
    root.style.backgroundImage = `url(${blurImg})`;
    root.style.backgroundPosition = "center";
    root.style.backgroundRepeat = "no-repeat";
    root.style.backgroundSize = "cover";
  }, [isLogin]);

  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/" Component={Auth} />)
  );
  const protectedRouter = createBrowserRouter(
    createRoutesFromElements(<Route path="/" Component={Home} />)
  );

  return <RouterProvider router={isLogin ? protectedRouter : router} />;
};

export default App;
