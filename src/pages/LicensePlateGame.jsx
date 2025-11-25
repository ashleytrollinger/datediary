import { useState, useEffect } from "react";
import "../pages/LicensePlateGame.css";

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function LicensePlateGame({ session, setSession }) {
    const [checked, setChecked] = useState(() => {
        return session?.licensePlate?.checked || {};
    });


    // Update session count whenever checked changes
    useEffect(() => {
        const count = Object.values(checked).filter(Boolean).length;
        setSession(prev => ({
            ...prev,
            licensePlate: {
                ...prev.licensePlate,
                checked,
                count,
                total: states.length
            }
        }));
        sessionStorage.setItem("licensePlates", JSON.stringify(checked)); // optional persistence
    }, [checked, setSession]);

    const toggleState = (state) => {
        setChecked(prev => ({ ...prev, [state]: !prev[state] }));
    };

    return (
        <div className="license-plate-game">
            <p>States found: {Object.values(checked).filter(Boolean).length} / {states.length}</p>

            <div className="states-list">
                {states.map((s) => (
                    <label key={s} className="state-item">
                        <input
                            type="checkbox"
                            checked={checked[s] || false}
                            onChange={() => toggleState(s)}
                        />
                        {s}
                    </label>
                ))}
            </div>
        </div>
    );


}

