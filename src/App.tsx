import React from 'react';
import './App.css';
import Login from './components/login'
// import Main from './components/main';
import {Link, Route, Routes, BrowserRouter as Router} from 'react-router-dom'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/main" /*Component={}*/ />
      </Routes>
    </Router>
    
  );
}

export default App;
