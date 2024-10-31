import { useState } from 'react'
import './App.css'
import { Outlet, Link } from "react-router-dom"; 

function App() {

  const [deckList, setDeckList] = useState({
    deck: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Specify the file type

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeckList((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    console.log("Selected file:", file); // Optional: log the file
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    console.log('Form submitted:', deckList, selectedFile); // Check form data and selected file
  };

  return (
    <div>
      <div className = "mainContainer">
        <div className = "navigationBar">
          <p className = "headerTextBold">Pokemon Test Hand Generator</p>
          <p className = "headerText">Github</p>
        </div>
        <div className = "divider"/>
        <p className = "mainText">Deck</p>
        <div className = "mainBody">
          <div className = "inputDeck">
            <form onSubmit = {handleSubmit}>
              <div>
                <label htmlFor="deck"></label>
                <textarea className = "deckInputDiv" id="deck" name="deck" value={deckList.deck} onChange={handleChange}/>
              </div>
            </form>
            <button className="generateButton" type="submit">Generate</button>
            <div>
              <input
                type="file"
                onChange={handleFileChange} // Event handler for file input
              />
            </div>
          </div>
          <div className = "testHands">
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
