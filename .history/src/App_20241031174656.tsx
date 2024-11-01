import { useState } from 'react';
import './App.css';

function App() {
  const [deckList, setDeckList] = useState({
    deck: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleHand, setSampleHand] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeckList((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setDeckList((prevData) => ({
          ...prevData,
          deck: fileContent
        }));
      };
      reader.readAsText(file);
    }
  };

  const parseDeck = () => {
    return deckList.deck
      .split('\n')
      .filter(line => line.trim() !== '' && !/^(Pokémon:|Trainer:|Energy:|Total Cards:)/.test(line))
      .flatMap(line => {
        const match = line.match(/^(\d+)\s+(.+)$/);
        if (match) {
          const quantity = parseInt(match[1], 10);
          const cardName = match[2];
          return Array(quantity).fill(cardName);
        }
        return [line];
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardArray = parseDeck();

    if (cardArray.length < 7) {
      alert("Deck must contain at least 7 cards to generate a hand.");
      return;
    }

    const shuffledDeck = cardArray.sort(() => 0.5 - Math.random());
    const hand = shuffledDeck.slice(0, 7);
    setSampleHand(hand);
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
                  onChange={handleFileChange}
                />
              </div>
              <button className="generateButton" type="submit">Generate</button>
            </form>
          </div>
          <div className="testHands">
            <div className="cardRow">
              {sampleHand.map((card, index) => (
                <div key={index} className="card">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
