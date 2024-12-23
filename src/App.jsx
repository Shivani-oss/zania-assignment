import React, { useState } from 'react';
import './App.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const documents = [
  { type: 'bank-draft', title: 'Bank Draft', position: 0 },
  { type: 'bill-of-lading', title: 'Bill of Lading', position: 1 },
  { type: 'invoice', title: 'Invoice', position: 2 },
  { type: 'bank-draft-2', title: 'Bank Draft 2', position: 3 },
  { type: 'bill-of-lading-2', title: 'Bill of Lading 2', position: 4 },
];

const thumbnails = {
  'bank-draft': 'https://dummyimage.com/150x150/5a9/fff&text=Bank+Draft', // Bank Draft
  'bill-of-lading':
    'https://dummyimage.com/150x150/595/fff&text=Bill+of+Lading', // Bill of Lading
  invoice: 'https://dummyimage.com/150x150/954/fff&text=Invoice', // Invoice
  'bank-draft-2': 'https://dummyimage.com/150x150/5aa/fff&text=Bank+Draft+2', // Bank Draft 2
  'bill-of-lading-2':
    'https://dummyimage.com/150x150/5a5/fff&text=Bill+of+Lading+2', // Bill of Lading 2
};

function Card({ item, moveCard, onClick }) {
  const [, ref] = useDrag({
    type: 'CARD',
    item: { position: item.position },
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (draggedItem) => {
      if (draggedItem.position !== item.position) {
        moveCard(draggedItem.position, item.position);
        draggedItem.position = item.position;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="card"
      onClick={() => onClick(item.type)}
    >
      <img src={thumbnails[item.type]} alt={item.title} className="thumbnail" />
      <p>{item.title}</p>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState(documents);
  const [overlayImage, setOverlayImage] = useState(null);

  const moveCard = (from, to) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(from, 1);
    updatedCards.splice(to, 0, movedCard);
    setCards(updatedCards.map((card, index) => ({ ...card, position: index })));
  };

  const handleOverlayClose = (e) => {
    if (e.key === 'Escape') {
      setOverlayImage(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleOverlayClose);
    return () => document.removeEventListener('keydown', handleOverlayClose);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="grid">
          {cards.map((card) => (
            <Card
              key={card.type}
              item={card}
              moveCard={moveCard}
              onClick={(type) => setOverlayImage(thumbnails[type])}
            />
          ))}
        </div>
        {overlayImage && (
          <div className="overlay" onClick={() => setOverlayImage(null)}>
            <img src={overlayImage} alt="Overlay" className="overlay-image" />
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
