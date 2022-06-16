import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = 'https://deckofcardsapi.com/api/deck'

function AutoDeckOfCards() {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    // Start by collecting our deck id.
    useEffect(() => {
        async function getData() {
            let d = await axios.get(`${BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    useEffect(() => {
        async function pickCard() {
            let { deck_id } = deck

            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`)
                if (drawRes.data.remaining === 0) {
                    setAutoDraw(false)
                    alert("All out of cards!")
                }
                console.log(drawRes.data.cards[0])
                setDrawn(d => [
                    ...d, {
                        id: drawRes.data.cards[0].code,
                        name: drawRes.data.cards[0].suit + " " + drawRes.data.cards[0].value,
                        image: drawRes.data.cards[0].image
                    }
                ])

            } catch (err) {
                alert(err)
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await pickCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck])

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        // eslint-disable-next-line
        <img key={c.id} name={c.name} src={c.image} alt={c.id} style={{ position: "absolute" }} />
    ))

    return (
        <>
            <h3>{deck ? deck.deck_id : "Loading..."}</h3>
            <button onClick={toggleAutoDraw}>Gimme a card!</button>
            <div>{cards}</div>
        </>
    )
}

export default AutoDeckOfCards