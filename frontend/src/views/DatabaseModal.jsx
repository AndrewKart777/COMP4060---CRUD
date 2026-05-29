import { useState } from "react";
import * as api from "../api.js";
import { EMOJIS, COLORS, FIELD_TYPES, Icon } from "../shared.jsx";

export const DatabaseModal = ({ database, onSave, onClose }) => {
  const [form, setForm] = useState(database || {
    name: "", description: "", emoji: "📊", color: "#4ecdc4",
    fields: [{ name: "name", type: "text", options: [] }],
  });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addField = () => {
    setForm(f => ({ ...f, fields: [...(f.fields || []), { name: "", type: "text", options: [] }] }));
  };
  const updateField = (idx, key, value) => {
    setForm(f => ({
      ...f,
      fields: f.fields.map((field, i) => i === idx ? { ...field, [key]: value } : field),
    }));
  };
  const removeField = (idx) => {
    setForm(f => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));
  };

  const save = async () => {
    if (!form.name.trim()) return;
    // Validate fields: every field needs a name
    const validFields = (form.fields || [])
      .filter(f => f.name.trim())
      .map(f => ({
        name: f.name.trim(),
        type: f.type,
        options: f.type === "select"
          ? (typeof f.options === "string"
              ? f.options.split(",").map(s => s.trim()).filter(Boolean)
              : f.options || [])
          : [],
      }));

    setLoading(true);
    try {
      const { id, records, owner_id, created_at, ...rest } = form;
      const payload = { ...rest, fields: validFields };
      const result = database ? await api.updateDatabase(database.id, payload) : await api.createDatabase(payload);
      if (database) result.records = database.records || [];
      onSave(result);
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-title">{database ? "Edit Database" : "New Database"}</div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="e.g. Students, Employees, Books" value={form.name}
                 onChange={e => u("name", e.target.value)} autoFocus/>
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <input className="form-input" placeholder="What is this database for?" value={form.description || ""}
                 onChange={e => u("description", e.target.value)}/>
        </div>

        <div className="form-group">
          <label className="form-label">Emoji</label>
          <div className="emoji-grid">
            {EMOJIS.map(e => (
              <div key={e} className={`emoji-opt ${form.emoji === e ? "selected" : ""}`} onClick={() => u("emoji", e)}>{e}</div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-grid">
            {COLORS.map(c => (
              <div key={c} className={`color-opt ${form.color === c ? "selected" : ""}`}
                   style={{ background: c }} onClick={() => u("color", c)}/>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Fields (columns)</label>
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10 }}>
            Define the columns for your records. Each field has a name and a type.
          </div>
          {(form.fields || []).map((field, i) => (
            <div className="field-row" key={i}>
              <div style={{ flex: 2 }}>
                <input className="form-input" placeholder="Field name (e.g. first_name)"
                       value={field.name} onChange={e => updateField(i, "name", e.target.value)}/>
              </div>
              <div style={{ flex: 1 }}>
                <select className="select-input" value={field.type} onChange={e => updateField(i, "type", e.target.value)}>
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeField(i)} title="Remove field">
                <Icon name="trash" size={13}/>
              </button>
              {field.type === "select" && (
                <div style={{ flexBasis: "100%", marginTop: 6 }}>
                  <input className="form-input" placeholder="Comma-separated options (e.g. low, medium, high)"
                         value={Array.isArray(field.options) ? field.options.join(", ") : (field.options || "")}
                         onChange={e => updateField(i, "options", e.target.value)}/>
                </div>
              )}
            </div>
          ))}
          <button className="btn btn-secondary btn-sm btn-full" onClick={addField} style={{ marginTop: 4 }}>
            <Icon name="plus" size={13}/> Add Field
          </button>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!form.name.trim() || loading}>
            {loading ? <span className="spinner"/> : database ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
