import { useState, useEffect } from 'react';
import './App.css';
import TCGdex from '@tcgdex/sdk'

function App() {
  const [deckList, setDeckList] = useState({
    deck: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleHands, setSampleHands] = useState<string[][]>([]); // Holds multiple test hands
  const [showScrollTop, setShowScrollTop] = useState(false); // Controls the visibility of the scroll-to-top button
  const [cardData, setCardData] = useState<any | null>(null); // State to hold cards
  const [sets, setSets] = useState<any[]>([]); // State to hold the sets data

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

    setSampleHands((prevHands) => [...prevHands, hand]);
  };

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); // Show button when scrolled 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to clear all generated test hands
  const clearHands = () => {
    setSampleHands([]); // Reset sampleHands to an empty array
  };

  const tcgdex = new TCGdex('en');

  useEffect(() => {
    (async () => {
      const fetchBound = fetch.bind(window);
      try {
        const response = await fetchBound('https://api.tcgdex.net/v2/en/cards/swsh3.5-01'); // Directly fetch card data
        const card = await response.json();
        setCardData(card); // Set the fetched card data in the state
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    })();
  }, []);

  // Construct the image URL with quality and extension
  const quality = "high"; // or "low"
  const extension = "png"; // or "webp" or "jpg"
  const imageUrl = cardData ? `${cardData.image}/${quality}.${extension}` : "";

  return (
    <div>
      <div className="mainContainer">
        <div className="navigationBar">
          <p className="headerTextBold">Pokemon Test Hand Generator</p>
          <p className="headerText">Github</p>
        </div>
        <div className="divider"/>
        <div className="mainBody">
          <div className="inputDeck">
            <p className="mainText">Deck</p>
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
          <div className = "topRow">
          <p className="mainText">Test Hands</p>
          <button onClick={clearHands}>Clear</button> {/* Clear button with onClick */}
          </div>
            {sampleHands.map((hand, handIndex) => (
              <div key={handIndex} className="cardRow">
                {hand.map((card, index) => (
                  <div key={index} className="card">
                    {card}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1>Pokemon Card Information</h1>
          <div className="cards">
            {cardData ? (
              <div>
                <h2>{cardData.name}</h2>
                {cardData.image && (
                  <img src={imageUrl} alt={cardData.name} className="cardImage" />
                )}
                <pre>{JSON.stringify(cardData, null, 2)}</pre> {/* Display all card data */}
              </div>
            ) : (
              <p>Loading card data...</p>
            )}
          </div>
        </div>
      </div>
      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <button className="scrollTopButton" onClick={scrollToTop}>
          ⬆️ {/* You can replace this with an SVG icon or another arrow style */}
        </button>
      )}
    </div>
  );
}

export default App;
