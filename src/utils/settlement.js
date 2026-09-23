export function paymentId(fromId, toId, amount) {
  return `${fromId}-${toId}-${Number(amount).toFixed(2)}`;
}

export function optimizeSettlements(balances, members) {
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.01)
    .map(([id, v]) => ({ id, amount: -v }));
  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.01)
    .map(([id, v]) => ({ id, amount: v }));
  const out = [];
  let d = 0,
    c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amount = Math.min(debtors[d].amount, creditors[c].amount);
    const from = members.find((m) => m.id === debtors[d].id);
    const to = members.find((m) => m.id === creditors[c].id);
    out.push({ id: paymentId(debtors[d].id, creditors[c].id, amount), from, to, amount });
    debtors[d].amount -= amount;
    creditors[c].amount -= amount;
    if (debtors[d].amount < 0.01) d++;
    if (creditors[c].amount < 0.01) c++;
  }
  return out;
}
