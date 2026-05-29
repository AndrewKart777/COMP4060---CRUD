export const EMOJIS = ["📋","✅","🛒","📚","💪","🎯","🏃","💡","🎮","🎵","✈️","🍽️","💰","🔧","🌱","📸","🏠","💻","🧘","🎨","📊","🔬","🤝","⚡","🎓","🏢","🚗","🐾","📞","🗂️"];

// New palette — accent colours from the name palette
export const COLORS = ["#004E89","#71816D","#13070C","#6D8196","#F2EF81","#CDE6F5"];

export const STATUS_OPTIONS = ["todo","in-progress","done"];
export const STATUS_LABELS = { "todo":"To Do","in-progress":"In Progress","done":"Done" };

export const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
  { value: "select", label: "Dropdown" },
];

export const avatarColor = (name) => ["#004E89","#71816D","#6D8196","#13070C","#71816D"][name.charCodeAt(0)%5];
export const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

// ── ACTA Logo — uses the name palette colours per letter ──────────────────────
// A (navy) C (sage) T (black) A (navy) — with F2EF81 / CDE6F5 reserved for accents
export const ActaLogo = ({ size = 28 }) => (
  <span className="acta-logo" style={{ fontSize: size }}>
    <span style={{ color: "#004E89" }}>A</span>
    <span style={{ color: "#71816D" }}>C</span>
    <span style={{ color: "#13070C" }}>T</span>
    <span style={{ color: "#004E89" }}>A</span>
  </span>
);

const PATHS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  plus: "M12 5v14 M5 12h14",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  back: "M19 12H5 M12 19l-7-7 7-7",
};

export const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {PATHS[name]?.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d}/>)}
  </svg>
);
