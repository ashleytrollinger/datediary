import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-box">
        <h1> Welcome back! 💕</h1>
        <p> All things written on here are to be kept within the relationship and are not to be fought over.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          autoComplete="current-password"
        />
        <button onClick={handleLogin} className="login-button">
          Sign In
        </button>
      </div>
    </div>
  );
}
