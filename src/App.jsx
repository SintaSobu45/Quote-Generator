import React, { useState, useEffect } from "react";

function App() {
  const quotes = [
    { text: "Believe in yourself.", author: "Unknown" },
    { text: "Never stop learning.", author: "Einstein" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
    { text: "Stay positive, work hard, make it happen.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" }
  ];

  const colors = [
    "linear-gradient(135deg,#667eea,#764ba2)",
    "linear-gradient(135deg,#ff7e5f,#feb47b)",
    "linear-gradient(135deg,#43cea2,#185a9d)",
    "linear-gradient(135deg,#ff9966,#ff5e62)",
    "linear-gradient(135deg,#56ccf2,#2f80ed)"
  ];

  const [quote, setQuote] = useState(quotes[0]);
  const [bg, setBg] = useState(colors[0]);
  const [dark, setDark] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFav, setShowFav] = useState(false);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(1);
  const [loaded, setLoaded] = useState(false); // ⭐ prevents overwrite bug

  /* =========================
     LOAD FROM LOCAL STORAGE
  ========================== */
  useEffect(() => {
    const savedFav = localStorage.getItem("favQuotes");
    const savedTheme = localStorage.getItem("darkMode");

    if (savedFav) setFavorites(JSON.parse(savedFav));
    if (savedTheme !== null) setDark(JSON.parse(savedTheme));

    setLoaded(true); // storage loaded
  }, []);

  /* =========================
     SAVE TO LOCAL STORAGE (SAFE)
  ========================== */
  useEffect(() => {
    if (!loaded) return; // prevent first render overwrite

    localStorage.setItem("favQuotes", JSON.stringify(favorites));
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [favorites, dark, loaded]);

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    setQuote(quotes[randomIndex]);
    setBg(colors[colorIndex]);
    setCount(count + 1);
  };

  /* =========================
     COPY FUNCTION (WORKS LOCALHOST)
  ========================== */
  const copyQuote = () => {
    const text = `${quote.text} - ${quote.author}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => alert("Copied to clipboard! 📋"))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copied to clipboard! 📋");
  };

  const tweetQuote = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${quote.text} - ${quote.author}`,
      "_blank"
    );

  const isFav = favorites.some(q => q.text === quote.text);

  const addFavorite = () => {
    if (!isFav) setFavorites([...favorites, quote]);
  };

  const removeFavorite = index =>
    setFavorites(favorites.filter((_, i) => i !== index));

  const clearFavorites = () => setFavorites([]);

  const filteredFav = favorites.filter(f =>
    f.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ ...styles.page, background: bg }}>
      <div style={{
        ...styles.card,
        background: dark ? "#1f1f1f" : "rgba(255,255,255,0.2)",
        color: dark ? "white" : "#222"
      }}>

        <button style={styles.modeBtn} onClick={() => setDark(!dark)}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <h1 style={{ ...styles.title, color: dark ? "white" : "#222" }}>
          Pro Quote Generator
        </h1>

        <small>Quotes generated: {count}</small>

        <div style={styles.quoteBox}>
          <p style={styles.quote}>❝ {quote.text}</p>
          <p style={styles.author}>— {quote.author}</p>
        </div>

        <div>
          <button style={styles.button} onClick={generateQuote}>New</button>
          <button style={styles.button} onClick={copyQuote}>Copy</button>
          <button style={styles.button} onClick={tweetQuote}>Tweet</button>

          <button
            style={{ ...styles.button, opacity: isFav ? 0.5 : 1 }}
            onClick={addFavorite}
            disabled={isFav}
          >
            {isFav ? "Added ❤️" : "❤"}
          </button>

          <button style={styles.button} onClick={() => setShowFav(!showFav)}>
            ⭐ Favourites ({favorites.length})
          </button>
        </div>

        {showFav && (
          <div style={styles.favBox}>
            <input
              placeholder="Search favourites..."
              style={styles.search}
              onChange={e => setSearch(e.target.value)}
            />

            <button style={styles.clearBtn} onClick={clearFavorites}>
              Clear All
            </button>

            {filteredFav.map((fav, index) => (
              <div key={index} style={styles.favItem}>
                <p>"{fav.text}"</p>
                <small>— {fav.author}</small>
                <button
                  style={styles.removeBtn}
                  onClick={() => removeFavorite(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins"
  },
  card: {
    padding: "50px",
    borderRadius: "25px",
    width: "550px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    position: "relative"
  },
  title: { fontSize: "32px" },
  quoteBox: {
    margin: "30px 0",
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)"
  },
  quote: { fontSize: "22px" },
  author: { opacity: 0.7 },
  button: {
    padding: "10px 18px",
    margin: "6px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(45deg,#ff6a00,#ee0979)",
    color: "white"
  },
  modeBtn: {
    position: "absolute",
    right: "20px",
    top: "20px",
    padding: "8px 15px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer"
  },
  favBox: {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.15)",
    maxHeight: "220px",
    overflowY: "auto"
  },
  favItem: {
    marginBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.3)"
  },
  removeBtn: { marginTop: "5px" },
  clearBtn: { margin: "10px" },
  search: {
    padding: "8px",
    borderRadius: "10px",
    width: "80%"
  }
};

export default App;