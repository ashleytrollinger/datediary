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
    const [showEndTripModal, setShowEndTripModal] = useState(false);

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

    const handleEndTripConfirmed = async () => {
        setShowEndTripModal(false);

        if (!session) return;

        const docRef = doc(db, "roadtrips", tripId);

        const gamesToSave = {
            abcGame: {
                currentLetter: session.abcGame?.currentLetter || "",
                rounds: session.abcGame?.rounds || 0,
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
                    Couples Questions
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

            <button className="end-trip-btn" onClick={() => setShowEndTripModal(true)}>
                End Road Trip
            </button>

            {/* Modal Popup */}
            {showEndTripModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>End Trip</h2>
                        <p>When you end the trip you can no longer play or edit progress for any games.</p>
                        <div className="modal-buttons">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowEndTripModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={handleEndTripConfirmed}
                            >
                                End Trip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
