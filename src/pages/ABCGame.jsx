import { useState, useEffect } from "react";
import "../pages/abcGame.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ABCGame({ session, setSession }) {
    const [index, setIndex] = useState(() => {
        if (session?.abcGame?.currentLetter) {
            return alphabet.indexOf(session.abcGame.currentLetter);
        }
        return 0;
    });


    const [rounds, setRounds] = useState(() => {
        return session?.abcGame?.rounds || 0;
    });

    // Keep session.abcGame in sync with index and rounds
    useEffect(() => {
        const currentLetter = alphabet[index];
        setSession(prev => ({
            ...prev,
            abcGame: { currentLetter, rounds }
        }));
        sessionStorage.setItem("abcIndex", index); // optional persistence
    }, [index, rounds, setSession]);

    const updateIndex = (newIndex) => {
        let safeIndex = newIndex;
        let newRounds = rounds;

        if (newIndex < 0) {
            safeIndex = alphabet.length - 1;
            newRounds = rounds - 1 >= 0 ? rounds - 1 : 0; // optional: don't go negative
        } else if (newIndex >= alphabet.length) {
            safeIndex = 0;
            newRounds = rounds + 1;
        }

        setRounds(newRounds);
        setIndex(safeIndex);
    };

    return (
        <div className="abc-game">
            <p className="big-letter">{alphabet[index]}</p>
            <p>Rounds completed: {rounds}</p>

            <div className="abc-buttons">
                <button onClick={() => updateIndex(index - 1)}>← Prev</button>
                <button onClick={() => updateIndex(index + 1)}>Next →</button>
            </div>
        </div>
    );


}
