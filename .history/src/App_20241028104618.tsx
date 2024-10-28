import { useState } from 'react'
import './App.css'
import { Outlet, Link } from "react-router-dom"; 

function App() {

  return (
    <div>
      <div className = "mainContainer">
        <div className = "navigationBar">
          <a>Pokemon Test Hand Generator</a>
          <a>Github</a>
        </div>
      </div>
    </div>
  )
}

export default App
