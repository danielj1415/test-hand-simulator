import { useState } from 'react';
import './App.css';

function App() {
  const [deckList, setDeckList] = useState({
    deck: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Specify the file type
  const [sampleHand, setSampleHand] = useState<string[]>([]); // State to store the generated hand

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

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setDeckList((prevData) => ({
          ...prevData,
          deck: fileContent
        }));
      };
      reader.readAsText(file); // Reads the file as text
    }
  };

  // Function to parse the deck input into an array of individual cards
  const parseDeck = () => {
    return deckList.deck
      .split('\n') // Split input by line
      .filter(line => line.trim() !== '' && !/^(Pokémon:|Trainer:|Energy:)/.test(line)) // Ignore headers
      .flatMap(line => {
        const match = line.match(/^(\d+)\s+(.+)$/); // Match lines with quantities, e.g., "3 Teal Mask Ogerpon ex"
        if (match) {
          const quantity = parseInt(match[1], 10);
          const cardName = match[2];
          return Array(quantity).fill(cardName); // Create an array with 'quantity' instances of 'cardName'
        }
        return [line]; // For lines without quantity, just return the line itself
      });
  };

  // Handle form submission to generate a random sample hand of 7 cards
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Parse the deck and get an array of cards
    const cardArray = parseDeck();

    if (cardArray.length < 7) {
      alert("Deck must contain at least 7 cards to generate a hand.");
      return;
    }

    // Shuffle the deck and take the first 7 cards
    const shuffledDeck = cardArray.sort(() => 0.5 - Math.random());
    const hand = shuffledDeck.slice(0, 7); // Get the first 7 cards from the shuffled array
    setSampleHand(hand); // Set the sample hand state to display
  };

  return (
    <div>
      <div className="mainContainer">
        <div className="navigationBar">
          <p className="headerTextBold">Pokemon Test Hand Generator</p>
          <p className="headerText">Github</p>
        </div>
        <div className="divider"/>
        <p className="mainText">Deck</p>
        <div className="mainBody">
          <div className="inputDeck">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="deck"></label>
                <textarea
                  className="deckInputDiv"
                  id="deck"
                  name="deck"
                  value={deckList.deck}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="file"
                  onChange={handleFileChange} // Event handler for file input
                />
              </div>
              <button className="generateButton" type="submit">Generate</button>
            </form>
          </div>
          <div className="testHands">
            <h3>Sample Hand</h3>
            <ul>
              {sampleHand.map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;