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
          <div className = "inputDeck">
            <form>
              <div>
                <label htmlFor="deck"></label>
                <input type="text" id="name" name="name" value={FormData.name}/>
              </div>
            </form>
          </div>
          <div className = "testHands"></div>
        </div>
      </div>
    </div>
  )
}

export default App
