import { useState } from 'react'
import './App.css'
import { Outlet, Link } from "react-router-dom"; 

function App() {

  return (
    <div>
      <div className = "mainContainer">
        <div className = "navigationBar">
          <p>Pokemon Test Hand Generator</p>
          <p>Github</p>
        </div>
        <div className = "mainBody">
          <div className = "inputDeck"></div>
          <div className = "testHands"></div>
        </div>
      </div>
    </div>
  )
}

export default App
