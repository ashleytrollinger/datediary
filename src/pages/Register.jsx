import { useState } from "react";
import { auth, db } from "../firebase"; // assume you have Firestore initialized as 'db'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!firstName || !lastName || !dob) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        dob,
        email,
        createdAt: new Date().toISOString(),
      });

      alert("User registered successfully!");
      // Optionally redirect or clear form here

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>Register</h1>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={dob}
        onChange={e => setDob(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <button onClick={handleRegister} style={{ padding: 10, width: "100%" }}>
        Sign Up
      </button>
    </div>
  );
}
