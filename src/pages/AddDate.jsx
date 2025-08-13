import { useState } from "react";
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
      {showHeart && (
        <div className="heart-overlay">
          <div className="heart"></div>
        </div>
      )}

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
    </>
  );
}
