import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./AddDate.css"; // reuse the AddDate style for hearts and layout

export default function NewTrip() {
    const [title, setTitle] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [showHeart, setShowHeart] = useState(false);
    const [hearts, setHearts] = useState([]);
    const navigate = useNavigate();

    // Floating hearts animation
    useEffect(() => {
        const interval = setInterval(() => {
            const newHeart = {
                id: Math.random().toString(36).substr(2, 9),
                left: Math.random() * 90,
                scale: 1 + Math.random() * 1.5,
                duration: 5 + Math.random() * 5,
            };
            setHearts((prev) => [...prev, newHeart]);
            setTimeout(() => {
                setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
            }, newHeart.duration * 1000);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    const handleStartTrip = async () => {
        if (!title || !from || !to) return alert("All fields required!");
        try {
            const docRef = await addDoc(collection(db, "roadtrips"), {
                title,
                from,
                to,
                startDate: serverTimestamp(),
                games: {},
            });

            setShowHeart(true);
            setTimeout(() => {
                navigate(`/games/${docRef.id}`);
            }, 2000);
        } catch (err) {
            console.error("Failed to start trip", err);
        }
    };

    const handlePlayWithoutTrip = () => {
        // temporary session; tripId "temp"
        navigate("/games/temp");
    };

    return (
        <>
            {hearts.map((heart) => (
                <svg
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        animationDuration: `${heart.duration}s`,
                        transform: `scale(${heart.scale})`,
                    }}
                    viewBox="0 0 24 24"
                    fill="rgba(255,100,150,0.8)"
                    width="50"
                    height="50"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                        C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            ))}

            {showHeart && (
                <div className="heart-overlay">
                    <div className="heart"></div>
                </div>
            )}

            <div className="add-date">
                <div className="add-date-container">
                    <h1>Start a New Road Trip</h1>
                    <p className="info-blip">
                        Track your trip and play fun games along the way!
                    </p>

                    <input
                        placeholder="Trip Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        placeholder="From"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <input
                        placeholder="To"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />

                    <div className="button-row">
                        <button
                            onClick={() => navigate("/")}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartTrip}
                            className="save-button"
                        >
                            Start Trip 🚗
                        </button>
                        <button
                            onClick={handlePlayWithoutTrip}
                            className="play-button"
                        >
                            Play Without Trip 🎲
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
