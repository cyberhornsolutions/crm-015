import React from "react";
import "./App.css";
import Auth from "./components/auth";
import HomeEn from "./components/HomeEn";
import HomeRu from "./components/HomeRu";
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
<<<<<<< HEAD
// import "./components/login-stylHomee.css";
=======
// import "./components/login-style.css";
>>>>>>> dev
// import "./components/main-style.css";
// import "./components/test2.css";
// import "./components/test3.css";
// import "./components/single-widget.css";
// import "./index.css";
// import "./components/chart-tabs"; // Import the script
import "./components/side-main.css";
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.css";
import "./components/style.css";
=======
import "./components/style.css";
import "bootstrap/dist/css/bootstrap.css";
>>>>>>> dev

const App = () => {
  // return (
  //   <Router>
<<<<<<< HEAD
  //     <Routes>login
=======
  //     <Routes>
>>>>>>> dev
  //       <Route path="/login" Component={Login} index />
  //       <Route path="/main" /*Component={}*/ />
  //     </Routes>
  //   </Router>
  // );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
<<<<<<< HEAD
        login
        <Route path="/" Component={Auth} index />
        {/* <Route path="/en/main" Component={HomeEn} />
        <Route path="/ru/main" Component={HomeRu} /> */}
        <Route path="/main" Component={Home} />
=======
        <Route path="/" Component={Auth} index />
        <Route path="/en/main" Component={HomeEn} />
        <Route path="/ru/main" Component={HomeRu} />
>>>>>>> dev
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
