import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Home.css";
import "./AddDate.css"; // so the heart animation CSS is reused

export default function Home() {
    const [dates, setDates] = useState([]);
    const [userNamesMap, setUserNamesMap] = useState({});
    const [userName, setUserName] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [showHeart, setShowHeart] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");

    // Trigger heart animation on first load
    useEffect(() => {
        setShowHeart(true);
        const timer = setTimeout(() => setShowHeart(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (auth.currentUser) setCurrentUserId(auth.currentUser.uid);

        const fetchUserName = async () => {
            if (!auth.currentUser) return;
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                setUserName(`${data.firstName} ${data.lastName}`);
            }
        };
        fetchUserName();
    }, []);

    // Fetch dates and users — reacts to sortOrder change
    useEffect(() => {
        const fetchTimeline = async () => {
            const datesQuery = query(collection(db, "dates"), orderBy("date", sortOrder));
            const roadTripsQuery = query(collection(db, "roadtrips"), orderBy("startDate", sortOrder));

            const unsubscribeDates = onSnapshot(datesQuery, async (datesSnapshot) => {
                const datesData = datesSnapshot.docs.map((doc) => ({ id: doc.id, type: "date", ...doc.data() }));

                const creatorIDs = datesData.map((d) => d.userID).filter(Boolean);
                const partnerIDs = datesData.map((d) => d.partnerUserID).filter(Boolean);
                const allUserIDs = [...new Set([...creatorIDs, ...partnerIDs])];

                let usersMap = {};
                if (allUserIDs.length > 0) {
                    const usersQuery = query(collection(db, "users"), where("__name__", "in", allUserIDs));
                    const usersSnapshot = await getDocs(usersQuery);
                    usersSnapshot.forEach((userDoc) => {
                        const data = userDoc.data();
                        usersMap[userDoc.id] = `${data.firstName} ${data.lastName}`;
                    });
                }
                setUserNamesMap(usersMap);

                const roadTripsSnapshot = await getDocs(roadTripsQuery);
                const roadTripsData = roadTripsSnapshot.docs.map((doc) => ({ id: doc.id, type: "trip", ...doc.data() }));

                const combined = [...datesData, ...roadTripsData].sort(
                    (a, b) => new Date(a.date || a.startDate) - new Date(b.date || b.startDate)
                );

                setDates(combined);
            });

            return () => unsubscribeDates();
        };

        fetchTimeline();
    }, [sortOrder]);

    const handleCommentChange = (dateId, value) => {
        setCommentInputs((prev) => ({ ...prev, [dateId]: value }));
    };

    const savePartnerComment = async (date) => {
        if (!currentUserId) return;

        const newComment = commentInputs[date.id]?.trim();
        if (!newComment) {
            alert("Comment cannot be empty");
            return;
        }

        const dateDocRef = doc(db, "dates", date.id);
        try {
            await updateDoc(dateDocRef, {
                partnerComment: newComment,
                partnerUserID: currentUserId,
            });
            setCommentInputs((prev) => ({ ...prev, [date.id]: "" }));
        } catch (error) {
            alert("Failed to save comment: " + error.message);
        }
    };

    const getDatingDurationText = () => {
        const startDate = new Date("2025-03-31");
        const now = new Date();

        const diffMs = now - startDate;
        if (diffMs < 0) return "Not dating yet!";

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;

        let text = "Dating for ";
        if (months > 0) text += `${months} month${months > 1 ? "s" : ""}`;
        if (days > 0) text += months > 0 ? ` and ${days} day${days > 1 ? "s" : ""}` : `${days} day${days > 1 ? "s" : ""}`;
        if (months === 0 && days === 0) text = "Just started dating!";
        return text;
    };

    return (
        <>
            <div className="heart-bg">
                {[...Array(10)].map((_, i) => (
                    <span
                        key={i}
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${6 + Math.random() * 4}s`,
                        }}
                    ></span>
                ))}
            </div>

            {showHeart && (
                <div className="heart-overlay">
                    <div className="heart"></div>
                </div>
            )}

            <div className="home-container">
                <header className="home-hero">
                    <div className="hero-text">
                        <button onClick={() => signOut(auth)} className="logout-btn">
                            Logout
                        </button>
                        <h1>Welcome {userName}</h1>
                        <p style={{ fontStyle: "italic", marginTop: 4, opacity: 0.85 }}>
                            {getDatingDurationText()}
                        </p>
                    </div>

                    <div className="hero-controls">
                        <Link to="/add" className="add-date-button">
                            + Add a Date
                        </Link>
                        <Link to="/newtrip" className="add-date-button">
                            🎲 Road Trip
                        </Link>
                    </div>
                </header>

                <section className="dates-section">
                    <div className="sort-control">
                        <label htmlFor="sort">Sort by: </label>
                        <select
                            id="sort"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Newest to Oldest</option>
                            <option value="asc">Oldest to Newest</option>
                        </select>
                    </div>

                    {dates.length === 0 ? (
                        <p className="no-dates">No dates logged yet.</p>
                    ) : (
                        <div className="timeline">
                            {dates
                                .sort((a, b) => {
                                    const aDate = a.date
                                        ? new Date(a.date)
                                        : a.startDate?.toDate
                                            ? a.startDate.toDate()
                                            : new Date(a.startDate);
                                    const bDate = b.date
                                        ? new Date(b.date)
                                        : b.startDate?.toDate
                                            ? b.startDate.toDate()
                                            : new Date(b.startDate);
                                    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
                                })
                                .map((item) => {
                                    if (item.type === "date") {
                                        const creatorName = userNamesMap[item.userID] || "Unknown";
                                        const partnerName = item.partnerUserID
                                            ? userNamesMap[item.partnerUserID] || "Partner"
                                            : "Partner";
                                        const partnerComment = item.partnerComment || "";
                                        const canComment = currentUserId !== item.userID && !partnerComment;

                                        return (
                                            <div key={item.id} className="timeline-item">
                                                <div className="timeline-marker">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="#ff4d6d"
                                                        width="40"
                                                        height="40"
                                                    >
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
4.5 2.09C13.09 3.81 14.76 3 16.5 3 
19.58 3 22 5.42 22 8.5c0 3.78-3.4 
6.86-8.55 11.54L12 21.35z"/>
                                                    </svg>
                                                </div>
                                                <div className="timeline-content">
                                                    <div className="date-info">
                                                        <span className="timeline-date">
                                                            {(() => {
                                                                const [year, month, day] = item.date
                                                                    .split("-")
                                                                    .map(Number);
                                                                const parsed = new Date(year, month - 1, day);
                                                                return parsed.toLocaleDateString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                });
                                                            })()}
                                                        </span>
                                                        <small
                                                            className="creator-label"
                                                            style={{
                                                                color:
                                                                    item.userID ===
                                                                        "D0rh29intgVQATdHC8bQSWPeKFC2"
                                                                        ? "#ff758c"
                                                                        : "#4da6ff",
                                                                fontWeight: "600",
                                                            }}
                                                        >
                                                            Created by {creatorName}
                                                        </small>
                                                        <h3>{item.title}</h3>
                                                        <p>{item.description}</p>
                                                    </div>
                                                    {partnerComment && (
                                                        <p
                                                            className="partner-comment"
                                                            style={{
                                                                borderLeftColor:
                                                                    item.partnerUserID ===
                                                                        "D0rh29intgVQATdHC8bQSWPeKFC2"
                                                                        ? "#ff758c"
                                                                        : "#4da6ff",
                                                            }}
                                                        >
                                                            <strong>{partnerName}:</strong> {partnerComment}
                                                        </p>
                                                    )}
                                                    {canComment && (
                                                        <div className="comment-section">
                                                            <label>
                                                                Add your memory:
                                                                <textarea
                                                                    rows={5}
                                                                    className="comment-input"
                                                                    placeholder="How do you remember this date..."
                                                                    value={commentInputs[item.id] ?? ""}
                                                                    onChange={(e) =>
                                                                        handleCommentChange(item.id, e.target.value)
                                                                    }
                                                                />
                                                            </label>
                                                            <button
                                                                className="comment-save-button"
                                                                onClick={() => savePartnerComment(item)}
                                                            >
                                                                Save Memory
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    } else if (item.type === "trip") {
                                        return (
                                            <div key={item.id} className="timeline-item">
                                                <div className="timeline-marker">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4da6ff" width="40" height="40">
                                                        <path d="M5 16a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2zM3 11V9a2 2 0 012-2h14a2 2 0 012 2v2h1v7h-1a2 2 0 01-2 2h-1a2 2 0 01-2-2H9a2 2 0 01-2 2H6a2 2 0 01-2-2H3v-7h1zm2-2v2h14V9H5z" />
                                                    </svg>
                                                </div>
                                                <div className="timeline-content">
                                                    <span className="timeline-date">
                                                        {(() => {
                                                            const start = item.startDate?.toDate
                                                                ? item.startDate.toDate()
                                                                : new Date(item.startDate);
                                                            const end = item.endDate?.toDate
                                                                ? item.endDate.toDate()
                                                                : item.endDate
                                                                    ? new Date(item.endDate)
                                                                    : null;
                                                            return start.toLocaleDateString("en-US", {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }) + (end ? " – " + end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "");
                                                        })()}
                                                    </span>
                                                    <h3>{item.title}</h3>
                                                    <p>From: {item.from} ↠ To: {item.to}</p>
                                                    <p>License Plate Game: {item.games.licensePlate.count}/50</p>
                                                    <p>ABC Game: {item.games.abcGame.rounds} round(s), {item.games.abcGame.currentLetter}</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
