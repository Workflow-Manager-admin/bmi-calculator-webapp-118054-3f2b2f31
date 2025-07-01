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
  /** BMI Calculator App with responsive, light-themed, minimal UI */
  const [theme, setTheme] = useState("light");
  const [height, setHeight] = useState(""); // cm
  const [weight, setWeight] = useState(""); // kg
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

  // PUBLIC_INTERFACE
  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    // Validation
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmi(null);
      setCategory("");
      setError("Please enter valid (positive) numbers for height and weight.");
      return;
    }
    // Height in meters
    const hM = h / 100;
    const bmiValue = w / (hM * hM);
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBMI);
    setCategory(getBMICategory(roundedBMI));
  };

  // Suggestions mapping for each BMI category
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

  // UI for displaying BMI result, health category, and personalized suggestions
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
          }}
          data-testid="bmi-category"
        >
          {category}
        </div>
        {/* Suggestions Section */}
        <div
          className="bmi-suggestions"
          style={{
            marginTop: 16,
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
            Enter your height and weight to calculate your Body Mass Index (BMI)
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
              gap: 22,
            }}
            onSubmit={handleCalculate}
            autoComplete="off"
          >
            <div className="form-group">
              <label htmlFor="height" style={{ color: COLORS.primary, fontWeight: 500 }}>
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))}
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
            <div className="form-group">
              <label htmlFor="weight" style={{ color: COLORS.accent, fontWeight: 500 }}>
                Weight (kg)
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
                placeholder="e.g. 65"
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
