import React from 'react'
import ReactDOM from 'react-dom';
import BarcodeScanner from './views/BarcodeScanner'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BarcodeScanner />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

