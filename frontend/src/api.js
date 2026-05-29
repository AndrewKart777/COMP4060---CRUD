/**
 * api.js — all backend calls in one place.
 */
const BASE = import.meta.env.VITE_API_URL || "";

const getToken = () => localStorage.getItem("token");

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function register(name, email, password) {
  return request("POST", "/auth/register", { name, email, password });
}

export async function login(email, password) {
  const form = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE}/auth/login`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  localStorage.setItem("token", data.access_token);
  return data;
}

export const getMe = () => request("GET", "/auth/me");
export const logout = () => localStorage.removeItem("token");

// ── Trackers ──────────────────────────────────────────────────────────────────
export const getTrackers = () => request("GET", "/trackers/");
export const getTracker = (id) => request("GET", `/trackers/${id}`);
export const createTracker = (data) => request("POST", "/trackers/", data);
export const updateTracker = (id, data) => request("PUT", `/trackers/${id}`, data);
export const deleteTracker = (id) => request("DELETE", `/trackers/${id}`);

// ── Items ─────────────────────────────────────────────────────────────────────
export const getItems = (tid) => request("GET", `/trackers/${tid}/items/`);
export const createItem = (tid, data) => request("POST", `/trackers/${tid}/items/`, data);
export const updateItem = (tid, iid, data) => request("PUT", `/trackers/${tid}/items/${iid}`, data);
export const deleteItem = (tid, iid) => request("DELETE", `/trackers/${tid}/items/${iid}`);

// ── Databases ─────────────────────────────────────────────────────────────────
export const getDatabases = () => request("GET", "/databases/");
export const getDatabase = (id) => request("GET", `/databases/${id}`);
export const createDatabase = (data) => request("POST", "/databases/", data);
export const updateDatabase = (id, data) => request("PUT", `/databases/${id}`, data);
export const deleteDatabase = (id) => request("DELETE", `/databases/${id}`);

// ── Records ───────────────────────────────────────────────────────────────────
export const getRecords = (did) => request("GET", `/databases/${did}/records/`);
export const createRecord = (did, data) => request("POST", `/databases/${did}/records/`, data);
export const updateRecord = (did, rid, data) => request("PUT", `/databases/${did}/records/${rid}`, data);
export const deleteRecord = (did, rid) => request("DELETE", `/databases/${did}/records/${rid}`);
