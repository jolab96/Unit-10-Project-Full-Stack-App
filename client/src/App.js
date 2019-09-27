
// app.use(cors());
// import React from 'react';
import './App.css';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute'

import withContext from './Context'

import Header from './Components/Header'
import Courses from './Components/Courses'
import UserSignIn from './Components/UserSignIn'
import UserSignOut from './Components/UserSignOut'
import UserSignUp from './Components/UserSignUp'
import CourseDetail from './Components/CourseDetail'
import UpdateCourse from './Components/UpdateCourse'
import CreateCourse from './Components/CreateCourse'


const CourseDetailWithContext = withContext(CourseDetail);
const CoursesWithContext = withContext(Courses);
const CreateCourseWithContext = withContext(CreateCourse);
const HeaderWithContext = withContext(Header);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);



// import config from './config'; 
export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <HeaderWithContext />
<Switch>
          <Route exact path='/' component={CoursesWithContext} />
          <PrivateRoute path='/courses/create' component={CreateCourseWithContext} />
          <PrivateRoute path='/courses/:id/update' component={UpdateCourseWithContext} />
          <Route path='/courses/:id' component={CourseDetailWithContext} />
          <Route path='/signin' component={UserSignInWithContext} />
          <Route path='/signup' component={UserSignUpWithContext} />
          <Route path='/signout' component={UserSignOutWithContext} />
          </Switch>
        </Router>
      </div>

    );
  }
}



