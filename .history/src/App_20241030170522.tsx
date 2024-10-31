import { useState } from 'react'
import './App.css'
import { Outlet, Link } from "react-router-dom"; 

function App() {

  return (
    <div>
      <div className = "mainContainer">
        <div className = "navigationBar">
          <Link>Pokemon Test Hand Generator</Link>
          <Link>Github</Link>
        </div>
      </div>
    </div>
  )
}

export default App
