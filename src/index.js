import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.render(
    <BrowserRouter basename='/MyReads-A-Book-Tracking-App'><App /></BrowserRouter>,
    document.getElementById('root')
)
