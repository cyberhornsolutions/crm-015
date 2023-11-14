import React from "react";
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
import "./components/side-main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap";
import "./components/style.css";

const App = () => {
  // return (
  //   <Router>
  //     <Routes>login
  //       <Route path="/login" Component={Login} index />
  //       <Route path="/main" /*Component={}*/ />
  //     </Routes>
  //   </Router>
  // );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" Component={Auth} index />
        <Route path="/main" Component={Home} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
