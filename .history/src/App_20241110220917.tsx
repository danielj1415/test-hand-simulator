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
  const [handImages, setHandImages] = useState<string[][]>([]); // State to hold the URLs of the card images 

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); // Show button when scrolled 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Mapping object for set codes
const setCodeMapping: { [key: string]: string } = {
  SVI: "sv01",
  PAL: "sv02",
  OBF: "sv03",
  MEW: "sv03.5",
  PAR: "sv04",
  PAF: "sv04.5",
  TEF: "sv05",
  TWM: "sv06",
  SFA: "sv06.5",
  SCR: "sv07",
  SSH: "swsh1",
  RCL: "swsh2",
  DAA: "swsh3",
  CPA: "swsh3.5",
  VIV: "swsh4",
  SHF: "swsh4.5",
  BST: "swsh5",
  CRE: "swsh6",
  EVS: "swsh7",
  FST: "swsh8",
  BRS: "swsh9",
  ASR: "swsh10",
  PGO: "swsh10.5",
  LOR: "swsh11",
  SIT: "swsh12",
  CRZ: "swsh12.5",
  PR: "swshp",
  CEL: "cel25"
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

    console.log(hand[0]);
    

  };

  // Extract set ID and card ID based on custom mapping
const extractSetIdAndCardId = (cardName: string): [string, string] => {
  const parts = cardName.split(" ");
  const setCode = parts[parts.length - 2];
  const cardId = parts[parts.length - 1];

  const mappedSetId = setCodeMapping[setCode];
  if (!mappedSetId) {
    throw new Error(`Set code "${setCode}" not found in mapping.`);
  }

  return [mappedSetId, cardId];
};

// Revised handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const cardArray = parseDeck();
  if (cardArray.length < 7) {
    alert("Deck must contain at least 7 cards to generate a hand.");
    return;
  }

  const shuffledDeck = cardArray.sort(() => 0.5 - Math.random());
  const hand = shuffledDeck.slice(0, 7);
  setSampleHands((prevHands) => [...prevHands, hand]);

  const fetchBound = fetch.bind(window);
  const handImagesArray = await Promise.all(
    hand.map(async (cardName) => {
      const [setId, cardId] = extractSetIdAndCardId(cardName);
      try {
        const response = await fetchBound(`https://api.tcgdex.net/v2/en/cards/${setId}-${cardId}`);
        const cardData = await response.json();

        const quality = "high";
        const extension = "png";
        return cardData.image ? `${cardData.image}/${quality}.${extension}` : "";
      } catch (error) {
        console.error("Error fetching card data for:", cardName, error);
        return "";
      }
    })
  );

  setHandImages((prevImages) => [...prevImages, handImagesArray]);
};

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
