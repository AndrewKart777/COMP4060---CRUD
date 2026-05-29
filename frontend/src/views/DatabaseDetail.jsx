import { useState } from "react";
import * as api from "../api.js";
import { Icon } from "../shared.jsx";

// ── Record Modal ──────────────────────────────────────────────────────────────
const RecordModal = ({ record, database, onSave, onClose }) => {
  // Initialize form from record.data or empty for each field
  const initial = {};
  for (const f of database.fields || []) {
    initial[f.name] = record?.data?.[f.name] ?? (f.type === "boolean" ? false : "");
  }
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true);
    try {
      // Coerce types
      const cleaned = {};
      for (const f of database.fields || []) {
        const v = form[f.name];
        if (f.type === "number") cleaned[f.name] = v === "" ? null : Number(v);
        else cleaned[f.name] = v;
      }
      const result = record
        ? await api.updateRecord(database.id, record.id, { data: cleaned })
        : await api.createRecord(database.id, { data: cleaned });
      onSave(result);
    } finally { setLoading(false); }
  };

  const renderInput = (field) => {
    const v = form[field.name];
    if (field.type === "text") {
      return <input className="form-input" value={v || ""} onChange={e => u(field.name, e.target.value)} placeholder={field.name}/>;
    }
    if (field.type === "number") {
      return <input className="form-input" type="number" value={v ?? ""} onChange={e => u(field.name, e.target.value)} placeholder="0"/>;
    }
    if (field.type === "date") {
      return <input className="form-input" type="date" value={v || ""} onChange={e => u(field.name, e.target.value)}/>;
    }
    if (field.type === "boolean") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }} onClick={() => u(field.name, !v)}>
          <div className={`checkbox ${v ? "checked" : ""}`}>
            {v && <Icon name="check" size={11}/>}
          </div>
          <span style={{ fontSize: 14, cursor: "pointer" }}>{v ? "Yes" : "No"}</span>
        </div>
      );
    }
    if (field.type === "select") {
      return (
        <select className="select-input" value={v || ""} onChange={e => u(field.name, e.target.value)}>
          <option value="">— Choose —</option>
          {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-title">{record ? "Edit Record" : "Add Record"}</div>
        {(database.fields || []).length === 0 ? (
          <div style={{ color: "var(--muted)", padding: 12, background: "var(--surface2)", borderRadius: 8, fontSize: 13 }}>
            This database has no fields yet. Click "Edit" on the database to define fields first.
          </div>
        ) : (database.fields || []).map(field => (
          <div className="form-group" key={field.name}>
            <label className="form-label">{field.name} <span className="field-type">({field.type})</span></label>
            {renderInput(field)}
          </div>
        ))}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={loading || (database.fields || []).length === 0}>
            {loading ? <span className="spinner"/> : record ? "Save" : "Add Record"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Cell renderer ─────────────────────────────────────────────────────────────
const formatCell = (value, type) => {
  if (value === null || value === undefined || value === "") return <span style={{ color: "var(--muted)" }}>—</span>;
  if (type === "boolean") return value ? "✓ Yes" : "✗ No";
  if (type === "date") return value;
  return String(value);
};

export const DatabaseDetail = ({ database, onUpdate, onBack }) => {
  const [search, setSearch] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const records = database.records || [];
  const fields = database.fields || [];

  // Search across all field values
  const filtered = records.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return Object.values(r.data || {}).some(v => String(v ?? "").toLowerCase().includes(s));
  });

  const saveRecord = (saved) => {
    const exists = records.find(r => r.id === saved.id);
    const newRecords = exists ? records.map(r => r.id === saved.id ? saved : r) : [...records, saved];
    onUpdate({ ...database, records: newRecords });
    setShowRecordModal(false); setEditRecord(null);
  };
  const deleteRecord = async (id) => {
    await api.deleteRecord(database.id, id);
    onUpdate({ ...database, records: records.filter(r => r.id !== id) });
  };

  return (
    <div className="content" style={{ animation: "fadeUp 0.3s ease" }}>
      {(showRecordModal || editRecord) && (
        <RecordModal record={editRecord} database={database} onSave={saveRecord}
                     onClose={() => { setShowRecordModal(false); setEditRecord(null); }}/>
      )}

      <div className="detail-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="back" size={14}/> Back</button>
        <div style={{ fontSize: 36 }}>{database.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="detail-name">{database.name}</div>
          {database.description && <div className="detail-desc">{database.description}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: database.color }}>{records.length}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>records</div>
        </div>
      </div>

      {/* Field schema badges */}
      {fields.length > 0 && (
        <div style={{ marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {fields.map(f => (
            <span key={f.name} className="field-pill">
              <strong>{f.name}</strong>
              <span className="field-type">{f.type}</span>
            </span>
          ))}
        </div>
      )}

      <div className="items-header">
        <input className="form-input" style={{ width: 240, padding: "6px 12px", fontSize: 13 }}
               placeholder="Search across all fields…" value={search} onChange={e => setSearch(e.target.value)}/>
        <button className="btn btn-primary btn-sm" onClick={() => setShowRecordModal(true)} style={{ marginLeft: "auto" }}
                disabled={fields.length === 0}>
          <Icon name="plus" size={14}/> Add Record
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚙️</div>
          <div className="empty-title">No fields defined</div>
          <div className="empty-desc">Edit this database to add fields (columns) before adding records.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">{records.length === 0 ? "No records yet" : "No records match"}</div>
          <div className="empty-desc">
            {records.length === 0 ? "Add your first record to populate this database." : "Try a different search."}
          </div>
          {records.length === 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowRecordModal(true)}>
              <Icon name="plus" size={13}/> Add Record
            </button>
          )}
        </div>
      ) : (
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                {fields.map(f => <th key={f.name}>{f.name}</th>)}
                <th style={{ width: 80, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  {fields.map(f => <td key={f.name}>{formatCell(r.data?.[f.name], f.type)}</td>)}
                  <td>
                    <div className="db-table-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditRecord(r)}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteRecord(r.id)}><Icon name="trash" size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
