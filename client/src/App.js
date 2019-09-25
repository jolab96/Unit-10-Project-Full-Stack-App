
// app.use(cors());
// import React from 'react';
import './App.css';

import React, { Component } from 'react';
import { BrowserRouter, Route, } from 'react-router-dom';
import Header from './Components/Header';
import Courses from './Components/Courses';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import CourseDetail from './Components/CourseDetail';



// import config from './config'; 
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path='/' component={Header} />
          <Route path='/courses' component={Courses} />
          <Route path='/signup' component={UserSignUp} />
          <Route path='/signin' component={UserSignIn} />
          <Route path='/signout' component={UserSignOut} />
         
        </div>
      </BrowserRouter>
    );
  }
}



