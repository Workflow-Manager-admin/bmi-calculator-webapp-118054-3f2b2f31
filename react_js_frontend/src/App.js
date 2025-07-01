import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette from requirements
const COLORS = {
  primary: "#3498db",
  secondary: "#2ecc71",
  accent: "#e67e22",
  text: "#282c34",
  error: "#b44633",
};

// Helper: get BMI category based on value
// PUBLIC_INTERFACE
function getBMICategory(bmi) {
  /** Returns the BMI health category given a BMI value. */
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Normal";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  if (bmi >= 30) return "Obese";
  return "";
}

// PUBLIC_INTERFACE
function App() {
  /**
   * BMI Calculator App with responsive, minimal/light-themed UI.
   * Now supports:
   * - Weight unit toggle (kg/lb)
   * - Height unit toggle (cm or feet/inches)
   * - Age & gender input
   */
  const [theme, setTheme] = useState("light");

  // Input fields and unit toggles
  const [weight, setWeight] = useState(""); // Number input, whatever unit
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" or "lb"
  const [heightCm, setHeightCm] = useState(""); // Only when unit is cm
  const [heightFt, setHeightFt] = useState(""); // Only when unit is ft/in
  const [heightIn, setHeightIn] = useState(""); // Only when unit is ft/in
  const [heightUnit, setHeightUnit] = useState("cm"); // "cm" or "ft-in"

  const [age, setAge] = useState("");
  const [gender, setGender] = useState(""); // "male" | "female" | "other" | ""

  // Output
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Apply theme CSS custom properties
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  /**
   * Converts all input fields to meters and kg, then calculates BMI
   * */
  // PUBLIC_INTERFACE
  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    let hMeters;
    let wKg;

    // Weight
    let w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setBmi(null);
      setCategory("");
      setError("Please enter a valid weight.");
      return;
    }
    if (weightUnit === "kg") {
      wKg = w;
    } else {
      wKg = w * 0.45359237; // lb to kg
    }

    // Height
    if (heightUnit === "cm") {
      let h = parseFloat(heightCm);
      if (isNaN(h) || h <= 0) {
        setBmi(null);
        setCategory("");
        setError("Please enter a valid height.");
        return;
      }
      hMeters = h / 100;
    } else {
      // ft/in
      let ft = parseFloat(heightFt) || 0;
      let inch = parseFloat(heightIn) || 0;
      if ((isNaN(ft) && isNaN(inch)) || (ft <= 0 && inch <= 0)) {
        setBmi(null);
        setCategory("");
        setError("Please enter a valid height.");
        return;
      }
      let totalInches = ft * 12 + inch;
      if (totalInches <= 0) {
        setBmi(null);
        setCategory("");
        setError("Please enter a valid height.");
        return;
      }
      let cm = totalInches * 2.54;
      hMeters = cm / 100;
    }

    // Age (optional; just display, not used in BMI)
    let a = age.trim() === "" ? null : parseInt(age, 10);
    if (a !== null && (isNaN(a) || a <= 0)) {
      setBmi(null);
      setCategory("");
      setError("Please enter a valid age or leave blank.");
      return;
    }

    // Gender (optional)
    let g = gender;

    // BMI calculation
    const bmiValue = wKg / (hMeters * hMeters);
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBMI);
    setCategory(getBMICategory(roundedBMI));
  };

  // Suggestions for each BMI category
  const bmiSuggestions = {
    Underweight: {
      diet: [
        "Eat more frequent, balanced meals.",
        "Include calorie-dense foods like nuts, bananas, avocados.",
        "Add healthy fats (olive oil, nut butters) to meals.",
        "Consider smoothies with fruits, milk/yogurt, nut butters for extra calories.",
      ],
      exercise: [
        "Focus on strength training to build muscle mass.",
        "Limit excessive cardio.",
        "Try yoga or pilates for overall fitness.",
      ],
    },
    Normal: {
      diet: [
        "Maintain a balanced diet with fruits and vegetables.",
        "Choose whole grains over refined ones.",
        "Include lean proteins (chicken, fish, beans).",
        "Watch portion sizes and stay hydrated.",
      ],
      exercise: [
        "Aim for at least 150 minutes of moderate activity per week.",
        "Include both cardio and strength exercises.",
        "Enjoy outdoor activities, walking, cycling, or swimming.",
      ],
    },
    Overweight: {
      diet: [
        "Increase intake of vegetables and fresh fruits.",
        "Choose whole grains and reduce sugar/saturated fats.",
        "Limit processed/junk foods.",
        "Eat mindful portions and avoid late-night snacking.",
        "Stay hydrated with water or herbal teas.",
      ],
      exercise: [
        "Start with low-impact cardio: brisk walking, cycling, swimming.",
        "Gradually add resistance training.",
        "Aim for at least 30 minutes most days of the week.",
        "Incorporate stretching to prevent injuries.",
      ],
    },
    Obese: {
      diet: [
        "Focus on vegetable-based, high-fiber meals.",
        "Limit sugar, processed foods, and sugary drinks.",
        "Opt for grilled or baked over fried foods.",
        "Eat smaller, more frequent meals if needed.",
        "Consult a healthcare provider for a tailored plan.",
      ],
      exercise: [
        "Begin with gentle, low-impact activity (walking, water aerobics).",
        "Increase activity level gradually as tolerance improves.",
        "Aim for short, regular sessions rather than long ones.",
        "Consider working with a fitness professional.",
      ],
    },
  };

  // UI for displaying BMI, health category, and suggestions, also echo age/gender if provided
  const renderResult = () =>
    bmi !== null && category ? (
      <div className="bmi-result" style={{ marginTop: 32 }}>
        <div className="bmi-value">
          Your BMI:{" "}
          <span
            style={{
              color:
                bmi < 18.5
                  ? COLORS.accent
                  : bmi < 25
                  ? COLORS.secondary
                  : bmi < 30
                  ? COLORS.primary
                  : COLORS.error,
              fontWeight: 700,
              fontSize: 32,
            }}
            data-testid="bmi-value"
          >
            {bmi}
          </span>
        </div>
        <div
          className="bmi-category"
          style={{
            color:
              category === "Normal"
                ? COLORS.secondary
                : category === "Underweight"
                ? COLORS.accent
                : category === "Overweight"
                ? COLORS.primary
                : COLORS.error,
            fontWeight: 600,
            fontSize: 22,
            marginTop: 4,
          }}
          data-testid="bmi-category"
        >
          {category}
        </div>
        {/* Show age/gender if provided */}
        {(age.trim() || gender) && (
          <div style={{
              color: "#756e5e",
              fontSize: 15.5,
              margin: "8px auto 0 auto",
              opacity: 0.90
            }}
            data-testid="demographic-info"
          >
            {age.trim() && (
              <span>
                <strong>Age:</strong> {age.trim()}{" "}
              </span>
            )}
            {gender && (
              <span>
                <strong>Gender:</strong> {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </span>
            )}
            <br />
            <span style={{ color: "#aaa", fontSize: 13 }}>
              <i>
                Note: BMI formula is the same for adults regardless of age/gender, <br />
                but other health factors can be relevant.
              </i>
            </span>
          </div>
        )}

        {/* Suggestions Section */}
        <div
          className="bmi-suggestions"
          style={{
            marginTop: 18,
            padding: "10px 2px 4px 2px",
            textAlign: "left",
            borderTop: "1px solid #e9ecef",
            fontSize: 15,
            color: "#343741",
            opacity: 0.97,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            {category === "Normal" ? "Tips to Stay Healthy:" : "Suggested Actions:"}
          </div>
          <div>
            <span style={{ fontWeight: 500, color: COLORS.primary }}>Diet: </span>
            <ul style={{
              margin: "8px 0 8px 20px",
              padding: 0,
              listStyleType: "disc",
              fontSize: 15,
              lineHeight: "1.55"
            }}>
              {(bmiSuggestions[category]?.diet || []).map((tip, i) => (
                <li key={`diet-${i}`}>{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <span style={{ fontWeight: 500, color: COLORS.secondary }}>Exercise: </span>
            <ul style={{
              margin: "8px 0 2px 20px",
              padding: 0,
              listStyleType: "disc",
              fontSize: 15,
              lineHeight: "1.55"
            }}>
              {(bmiSuggestions[category]?.exercise || []).map((tip, i) => (
                <li key={`exercise-${i}`}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ) : null;

  // Returns either one or two unit switch/radio controls, styled inline and minimal
  const renderUnitToggles = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 0 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 18, marginBottom: 4,
        marginLeft: 3
      }}>
        <span style={{ fontWeight: 500, color: COLORS.accent, fontSize: 15 }}>
          Weight unit:
        </span>
        <label style={{ marginRight: 8 }}>
          <input
            type="radio"
            name="weightUnit"
            value="kg"
            checked={weightUnit === "kg"}
            onChange={() => setWeightUnit("kg")}
          />{" "}
          kg
        </label>
        <label>
          <input
            type="radio"
            name="weightUnit"
            value="lb"
            checked={weightUnit === "lb"}
            onChange={() => setWeightUnit("lb")}
          />{" "}
          lb
        </label>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 18, marginBottom: 1,
        marginLeft: 3
      }}>
        <span style={{ fontWeight: 500, color: COLORS.primary, fontSize: 15 }}>
          Height unit:
        </span>
        <label style={{ marginRight: 10 }}>
          <input
            type="radio"
            name="heightUnit"
            value="cm"
            checked={heightUnit === "cm"}
            onChange={() => { setHeightUnit("cm"); setHeightFt(""); setHeightIn(""); }}
          />{" "}
          cm
        </label>
        <label>
          <input
            type="radio"
            name="heightUnit"
            value="ft-in"
            checked={heightUnit === "ft-in"}
            onChange={() => { setHeightUnit("ft-in"); setHeightCm(""); }}
          />{" "}
          ft/in
        </label>
      </div>
    </div>
  );

  // MAIN RENDER
  return (
    <div className="App" style={{ minHeight: "100vh", background: "#fff" }}>
      <header className="App-header" style={{ minHeight: "100vh", justifyContent: "flex-start" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div className="bmi-container">
          <h1 style={{ color: COLORS.primary, marginBottom: 6, fontWeight: 800 }}>
            BMI Calculator
          </h1>
          <p
            style={{
              color: COLORS.text,
              fontWeight: 400,
              margin: "0 0 1.5rem 0",
              fontSize: 17,
              opacity: 0.86,
            }}
          >
            Enter your height, weight, age, and gender to calculate your Body Mass Index (BMI)
          </p>
          <form
            className="bmi-form"
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 16px 0 rgba(52,152,219,0.04)",
              padding: 32,
              margin: "0 auto",
              minWidth: 275,
              maxWidth: 370,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
            onSubmit={handleCalculate}
            autoComplete="off"
          >
            {renderUnitToggles()}

            <div className="form-group" style={{ marginBottom: 0 }}>
              {/* WEIGHT */}
              <label htmlFor="weight" style={{ color: COLORS.accent, fontWeight: 500 }}>
                Weight ({weightUnit})
              </label>
              <input
                type="number"
                id="weight"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
                min="0"
                step="any"
                className="input-field"
                placeholder={weightUnit === "kg" ? "e.g. 65" : "e.g. 143"}
                required
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.accent}`,
                  fontSize: 17,
                  marginTop: 4,
                  width: "100%",
                  outline: "none",
                  background: "#f8f9fa",
                  color: COLORS.text,
                }}
                data-testid="weight-input"
              />
            </div>

            {/* Height field adapts to unit selection */}
            {heightUnit === "cm" ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="heightCm" style={{ color: COLORS.primary, fontWeight: 500 }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="heightCm"
                  inputMode="decimal"
                  value={heightCm}
                  onChange={(e) =>
                    setHeightCm(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  min="0"
                  step="any"
                  className="input-field"
                  placeholder="e.g. 170"
                  required
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.primary}`,
                    fontSize: 17,
                    marginTop: 4,
                    width: "100%",
                    outline: "none",
                    background: "#f8f9fa",
                    color: COLORS.text,
                  }}
                  data-testid="height-input"
                />
              </div>
            ) : (
              <div className="form-group" style={{ flexDirection: "row", gap: 7 }}>
                <label htmlFor="heightFt" style={{ color: COLORS.primary, fontWeight: 500, marginRight: 8 }}>
                  Height (ft/in)
                </label>
                <input
                  type="number"
                  id="heightFt"
                  inputMode="numeric"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value.replace(/[^0-9]/g, ""))}
                  min="0"
                  step="1"
                  className="input-field"
                  placeholder="ft"
                  required={heightUnit === "ft-in"}
                  style={{
                    padding: "12px 9px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.primary}`,
                    fontSize: 17,
                    marginTop: 4,
                    width: 53,
                    outline: "none",
                    display: "inline-block",
                    background: "#f8f9fa",
                    color: COLORS.text,
                  }}
                  data-testid="height-ft-input"
                />
                <span style={{ margin: "0 8px", fontWeight: 500, color: "#8d8b8b", fontSize: 17 }}>
                  ft
                </span>
                <input
                  type="number"
                  id="heightIn"
                  inputMode="numeric"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value.replace(/[^0-9]/g, ""))}
                  min="0"
                  max="11"
                  step="1"
                  className="input-field"
                  placeholder="in"
                  required={heightUnit === "ft-in"}
                  style={{
                    padding: "12px 9px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.primary}`,
                    fontSize: 17,
                    marginTop: 4,
                    width: 59,
                    outline: "none",
                    display: "inline-block",
                    background: "#f8f9fa",
                    color: COLORS.text,
                  }}
                  data-testid="height-in-input"
                />
                <span style={{ margin: "0 2px", fontWeight: 500, color: "#8d8b8b", fontSize: 17 }}>
                  in
                </span>
              </div>
            )}

            {/* Age input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="age" style={{ color: "#222", fontWeight: 500 }}>
                Age <span style={{ fontWeight: 400, color: "#858585" }}>(optional)</span>
              </label>
              <input
                type="number"
                id="age"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                min="1"
                max="120"
                step="1"
                className="input-field"
                placeholder="e.g. 26"
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: `1px solid #aaa`,
                  fontSize: 17,
                  marginTop: 4,
                  width: "100%",
                  outline: "none",
                  background: "#f8f9fa",
                  color: COLORS.text,
                }}
                data-testid="age-input"
              />
            </div>

            {/* Gender selection (optional) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="gender" style={{ color: "#446691", fontWeight: 500 }}>
                Gender <span style={{ fontWeight: 400, color: "#858585" }}>(optional)</span>
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-field"
                style={{
                  padding: "11px 13px",
                  borderRadius: 8,
                  border: "1px solid #aaa",
                  fontSize: 17,
                  marginTop: 4,
                  width: "100%",
                  outline: "none",
                  background: "#f8f9fa",
                  color: COLORS.text,
                }}
                data-testid="gender-select"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-calc"
              style={{
                background: `linear-gradient(90deg, ${COLORS.primary} 60%, ${COLORS.accent} 100%)`,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "13px 0",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                marginTop: 5,
                letterSpacing: 1,
                transition: "box-shadow 0.2s, transform 0.13s",
                boxShadow: "0 2px 8px 0 rgba(52,152,219,0.06)",
              }}
              data-testid="calculate-btn"
            >
              Calculate BMI
            </button>
          </form>
          {error && (
            <div
              data-testid="bmi-error"
              style={{
                color: COLORS.error,
                background: "#fff8f1",
                border: "1px solid #fae0d3",
                borderRadius: 7,
                padding: "10px 16px",
                margin: "16px auto 0",
                maxWidth: 340,
                fontWeight: 500,
                fontSize: 15,
              }}
            >
              {error}
            </div>
          )}
          {renderResult()}
        </div>
        <footer style={{ marginTop: "auto", padding: "36px 0 6px 0", opacity: 0.52, fontSize: 13 }}>
          © {new Date().getFullYear()} | BMI Calculator | Powered by React.js
        </footer>
      </header>
    </div>
  );
}

export default App;
