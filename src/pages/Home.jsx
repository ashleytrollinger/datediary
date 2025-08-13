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

export default function Home() {
    const [dates, setDates] = useState([]);
    const [userNamesMap, setUserNamesMap] = useState({});
    const [userName, setUserName] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        if (auth.currentUser) {
            setCurrentUserId(auth.currentUser.uid);
        }

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

    useEffect(() => {
        const q = query(collection(db, "dates"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const datesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDates(datesData);

            // Collect user IDs from both creators and commenters
            const creatorIDs = datesData.map((d) => d.userID).filter(Boolean);
            const partnerIDs = datesData.map((d) => d.partnerUserID).filter(Boolean);
            const allUserIDs = [...new Set([...creatorIDs, ...partnerIDs])];

            if (allUserIDs.length === 0) {
                setUserNamesMap({});
                return;
            }

            // Firestore 'in' query max 10 items — assume under 10 users
            const usersQuery = query(
                collection(db, "users"),
                where("__name__", "in", allUserIDs)
            );
            const usersSnapshot = await getDocs(usersQuery);

            const usersMap = {};
            usersSnapshot.forEach((userDoc) => {
                const data = userDoc.data();
                usersMap[userDoc.id] = `${data.firstName} ${data.lastName}`;
            });

            setUserNamesMap(usersMap);
        });

        return () => unsubscribe();
    }, []);

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
            // Clear input after save
            setCommentInputs((prev) => ({ ...prev, [date.id]: "" }));
        } catch (error) {
            alert("Failed to save comment: " + error.message);
        }
    };

    // Calculate how long you've been dating
    const getDatingDurationText = () => {
        const startDate = new Date("2025-03-31");
        const now = new Date();

        const diffMs = now - startDate;
        if (diffMs < 0) return "Not dating yet!";

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;

        let text = "Dating for ";
        if (months > 0) {
            text += `${months} month${months > 1 ? "s" : ""}`;
        }
        if (days > 0) {
            if (months > 0) text += " and ";
            text += `${days} day${days > 1 ? "s" : ""}`;
        }
        if (months === 0 && days === 0) {
            text = "Just started dating!";
        }

        return text;
    };

    return (
        <div className="home-container">
            <header className="home-hero">
                <div className="hero-text">
                    <button onClick={() => signOut(auth)} className="logout-btn">
                        Logout
                    </button>
                    <h1>Welcome, {userName}</h1>
                    <p>Keep track of your memories together ❤️</p>
                    <p style={{ fontStyle: "italic", marginTop: 4, opacity: 0.85 }}>
                        {getDatingDurationText()}
                    </p>
                </div>
                <Link to="/add" className="add-date-button">
                    + Add a Date
                </Link>
            </header>

            <section className="dates-section">
                {dates.length === 0 ? (
                    <p className="no-dates">No dates logged yet.</p>
                ) : (
                    <div className="timeline">
                        {dates.map((d) => {
                            const creatorName = userNamesMap[d.userID] || "Unknown";

                            // Partner's name from partnerUserID, fallback to "Partner"
                            const partnerName = d.partnerUserID
                                ? userNamesMap[d.partnerUserID] || "Partner"
                                : "Partner";

                            const partnerComment = d.partnerComment || "";
                            const canComment = currentUserId !== d.userID && !partnerComment;

                            return (
                                <div key={d.id} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <span className="timeline-date">
                                            {d.date}
                                        </span>
                                        <small className="creator-label">
                                            Created by {creatorName}
                                        </small>
                                        <h3>{d.title}</h3>
                                        <p>{d.description}</p>

                                        {partnerComment && (
                                            <p className="partner-comment">
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
                                                        value={commentInputs[d.id] ?? ""}
                                                        onChange={(e) =>
                                                            handleCommentChange(d.id, e.target.value)
                                                        }
                                                    />
                                                </label>
                                                <button
                                                    className="comment-save-button"
                                                    onClick={() => savePartnerComment(d)}
                                                >
                                                    Save Memory
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
