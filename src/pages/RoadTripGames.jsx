import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./Games.css";

import ABCGame from "../pages/ABCGame";
import LicensePlateGame from "../pages/LicensePlateGame";
import WouldYouRatherGame from "../pages/WouldYouRather";

export default function RoadTripGames() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [session, setSession] = useState(null);
    const [activeGame, setActiveGame] = useState("wouldYouRather"); // toggle view

    // Fetch the trip
    const fetchTrip = async () => {
        try {
            const docRef = doc(db, "roadtrips", tripId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setTrip({ id: snap.id, ...snap.data() });
            } else {
                console.error("Trip not found");
            }
        } catch (err) {
            console.error("Error fetching trip:", err);
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [tripId]);

    // Initialize session memory
    useEffect(() => {
        if (trip) {
            setSession(trip.games || {
                wouldYouRather: [],
                abcGame: { currentLetter: "" },
                licensePlate: { count: 0, total: 50 }
            });
        }
    }, [trip]);

    const handleEndTrip = async () => {
        if (!session) return;

        const docRef = doc(db, "roadtrips", tripId);

        // Explicitly construct the games map to save
        const gamesToSave = {
            abcGame: {
                currentLetter: session.abcGame?.currentLetter || "",
                rounds: session.abcGame?.rounds || ""
            },
            licensePlate: {
                count: session.licensePlate?.count || 0,
                total: session.licensePlate?.total || 50
            }
        };

        await updateDoc(docRef, {
            games: gamesToSave,
            endDate: serverTimestamp()
        });

        setSession(null);
        navigate("/");
    };

    if (!trip || !session) return <p>Loading trip...</p>;

    return (
        <div className="games-page">
            <header className="games-hero">
                <h1>{trip.title}</h1>
                <p>From {trip.from} → {trip.to}</p>
            </header>

            <div className="game-toggle-buttons">
                <button
                    className={activeGame === "wouldYouRather" ? "active" : ""}
                    onClick={() => setActiveGame("wouldYouRather")}
                >
                    Would You Rather
                </button>
                <button
                    className={activeGame === "abcGame" ? "active" : ""}
                    onClick={() => setActiveGame("abcGame")}
                >
                    ABC Game
                </button>
                <button
                    className={activeGame === "licensePlate" ? "active" : ""}
                    onClick={() => setActiveGame("licensePlate")}
                >
                    License Plate
                </button>
            </div>

            <section className="games-content">
                {activeGame === "wouldYouRather" && (
                    <WouldYouRatherGame session={session} setSession={setSession} tripId={tripId} />
                )}
                {activeGame === "abcGame" && (
                    <ABCGame session={session} setSession={setSession} />
                )}
                {activeGame === "licensePlate" && (
                    <LicensePlateGame session={session} setSession={setSession} />
                )}
            </section>

            <button className="end-trip-btn" onClick={handleEndTrip}>
                End Road Trip
            </button>
        </div>
    );

}