export function minimizeTransactions (accounts: { name: string, balance: number }[]) {
  // Separate positive and negative balances
  const positive: { name: string, balance: number }[] = [];
  const negative: { name: string, balance: number }[] = [];

  for (const account of accounts) {
    if (account.balance > 0) {
      positive.push(account);
    } else if (account.balance < 0) {
      negative.push(account);
    }
  }

  const transactions: { from: string, to: string, amount: number }[] = []

  while (positive.length && negative.length) {
    const posAccount = positive[0];
    const negAccount = negative[0];

    const minBalance = Math.min(posAccount.balance, -negAccount.balance);

    transactions.push({
      from: negAccount.name,
      to: posAccount.name,
      amount: minBalance
    });

    posAccount.balance -= minBalance;
    negAccount.balance += minBalance;

    if (posAccount.balance === 0) {
      positive.shift();
    }
    if (negAccount.balance === 0) {
      negative.shift();
    }
  }

  return transactions;
}
