import React from "react";
import "./App.css";
import Login from "./components/login";
import Auth from "./components/auth";
import HomeEn from "./components/HomeEn";
import HomeRu from "./components/HomeRu";
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
// import "./components/login-style.css";
// import "./components/main-style.css";
// import "./components/test2.css";
// import "./components/test3.css";
// import "./components/single-widget.css";
// import "./index.css";
// import "./components/chart-tabs"; // Import the script
import "./components/side-main.css";
import "./components/style.css";
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/login" Component={Login} index />
  //       <Route path="/main" /*Component={}*/ />
  //     </Routes>
  //   </Router>
  // );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" Component={Auth} index />
        <Route path="/en/main" Component={HomeEn} />
        <Route path="/ru/main" Component={HomeRu} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
