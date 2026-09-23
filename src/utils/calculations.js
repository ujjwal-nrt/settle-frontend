export function splitEqual(amount, members = []) {
  if (!members.length) {
    return [];
  }

  const total = Number(amount) || 0;

  const each = Number((total / members.length).toFixed(2));

  return members.map((member, index) => {
    const share = index === members.length - 1 ? Number((total - each * (members.length - 1)).toFixed(2)) : each;

    return {
      ...member,
      amount: share,
    };
  });
}

export function groupBalances(group) {
  const balances = {};

  if (!group) {
    return balances;
  }

  const members = Array.isArray(group.members) ? group.members : [];

  const expenses = Array.isArray(group.expenses) ? group.expenses : [];

  members.forEach((member) => {
    balances[member.id] = 0;
  });

  expenses.forEach((expense) => {
    const participants = Array.isArray(expense.expense_participants) ? expense.expense_participants : [];

    if (!participants.length) {
      return;
    }

    const totalAmount = Number(expense.amount) || 0;

    const paidBy = expense.paid_by;

    if (paidBy) {
      balances[paidBy] = (balances[paidBy] || 0) + totalAmount;
    }

    participants.forEach((participant) => {
      const userId = participant.user_id;
      const share = Number(participant.share) || 0;

      if (!userId) {
        return;
      }

      balances[userId] = (balances[userId] || 0) - share;
    });
  });

  Object.keys(balances).forEach((userId) => {
    balances[userId] = Number(balances[userId].toFixed(2));
  });

  return balances;
}
