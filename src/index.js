import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import AppWrapper from "./components/AppWrapper";

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

//Display our application in a root element
ReactDOM.render(
  <React.StrictMode>
      <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();