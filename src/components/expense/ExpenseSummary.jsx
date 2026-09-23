import {formatCurrency} from '../../utils/currency';
export default function ExpenseSummary({amount,paidBy,members}){return <div className="summary-card"><h3>Looks correct?</h3><div><span>Amount</span><b>{formatCurrency(amount)}</b></div><div><span>Paid by</span><b>{paidBy?.name||'—'}</b></div><div><span>Split between</span><b>{members.length} people</b></div></div>}
