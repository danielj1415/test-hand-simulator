import { useState } from 'react'
import './App.css'
import { Outlet, Link } from "react-router-dom"; 

function App() {

  const [deckList, setDeckList] = useState({
    deck: ''
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeckList((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    // Process the form data here (e.g., send to an API)
  };

  return (
    <div>
      <div className = "mainContainer">
        <div className = "navigationBar">
          <p>Pokemon Test Hand Generator</p>
          <p>Github</p>
        </div>
        <div className = "mainBody">
          <div className = "inputDeck">
            <form onSubmit = {handleSubmit}>
              <div>
                <label htmlFor="deck"></label>
                <input type="text" id="deck" name="deck" value={deckList.deck} onChange={handleChange}/>
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
