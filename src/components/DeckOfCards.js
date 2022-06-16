import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = 'https://deckofcardsapi.com/api/deck'

function DeckOfCards() {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])

    // Start by collecting our deck id.
    useEffect(() => {
        async function getData() {
            let d = await axios.get(`${BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    function handleSubmit(evt) {
        let { deck_id } = deck
        evt.preventDefault();
        async function pickCard() {
            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`)
                if (drawRes.data.remaining === 0) {
                    alert("All out of cards!")
                } else {
                    console.log(drawRes.data.cards[0])
                    setDrawn(d => [
                        ...d, {
                            id: drawRes.data.cards[0].code,
                            name: drawRes.data.cards[0].suit + " " + drawRes.data.cards[0].value,
                            image: drawRes.data.cards[0].image
                        }
                    ])
                }
            } catch (err) {
                throw err
            }
        }

        pickCard()
    }

    const cards = drawn.map(c => (
        // eslint-disable-next-line
        <img key={c.id} name={c.name} src={c.image} style={{ position: "absolute" }} alt="Card" />
    ))

    return (
        <>
            <h3>{deck ? deck.deck_id : "Loading..."}</h3>
            <button onClick={handleSubmit}>Gimme a card!</button>
            <div>{cards}</div>
        </>
    )
}

export default DeckOfCards