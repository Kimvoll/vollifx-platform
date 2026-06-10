export function money(value: unknown) {
  const numeric = Number(value || 0);
  return `$${numeric.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function percent(value: unknown) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function mapPool(row: any) {
  return {
    id: row.id,
    name: row.name,
    manager: row.manager,
    capital: money(row.capital),
    monthlyRoi: row.return_label,
    winRate: percent(row.win_rate),
    drawdown: percent(row.max_drawdown),
    risk: row.risk,
    investors: row.investors,
    minimum: `$${Number(row.minimum_deposit || 750).toLocaleString("en-US")}`,
    status: row.status,
    asset: row.asset,
    popular: true,
    returnSummary: row.return_summary || row.return_label
  };
}

export function mapTransaction(row: any) {
  return {
    id: row.id,
    method: row.method,
    type: row.type,
    amount: money(row.amount),
    status: row.status,
    reference: row.reference || "",
    destination: row.destination || "",
    network: row.network || "",
    proofUrl: row.proof_url || "",
    metadata: row.metadata || {},
    reviewedAt: row.reviewed_at || "",
    createdAt: row.created_at,
    date: new Date(row.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
  };
}
