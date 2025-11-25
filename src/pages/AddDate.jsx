import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AddDate.css";

export default function AddDate() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random().toString(36).substr(2, 9),
        left: Math.random() * 90, // percent from left
        scale: 1 + Math.random() * 1.5, // size multiplier
        duration: 5 + Math.random() * 5, // animation duration in seconds
      };
      setHearts((prev) => [...prev, newHeart]);

      // Remove hearts after animation finishes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, newHeart.duration * 1000);
    }, 600); // new heart every 0.6s

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!title || !date) {
      alert("Please fill in title and date");
      return;
    }
    try {
      await addDoc(collection(db, "dates"), {
        title,
        date,
        description,
        createdAt: serverTimestamp(),
        userID: auth.currentUser.uid,
      });

      setShowHeart(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/");
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
          <h1>Add a Date</h1>
          <p className="info-blip">
            Your other half will be able to view and add their own perspective to the date once saved.
          </p>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="button-row">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleSubmit} className="save-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
