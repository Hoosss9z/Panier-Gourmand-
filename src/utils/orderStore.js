// src/utils/orderStore.js

const KEY = "pg_orders";

export function getOrders() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function getOrder(id) {
  return getOrders().find(o => o.id === id);
}

export function saveOrders(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addOrder(order) {
  const list = getOrders();
  list.unshift(order);
  saveOrders(list);
  return order.id;
}

export function updateOrder(id, patch) {
  const list = getOrders();
  const idx = list.findIndex(o => o.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...patch };
  saveOrders(list);
}

export function nextStatus(current) {
  const flow = ["reçu", "en préparation", "expédié", "en livraison", "livré"];
  const i = flow.indexOf(current);
  return flow[Math.min(i + 1, flow.length - 1)];
}

export function markOrderSync(id, status) {
  const list = getOrders();
  const idx = list.findIndex(o => o.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], syncStatus: status, updatedAt: Date.now() };
  saveOrders(list);
}
