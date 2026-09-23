import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentButton({ groupId, payment }) {
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!payment) return;

    navigate(`/app/groups/${groupId}/payment/${payment.id}`);
  };

  return (
    <button type="button" className="payment-button" onClick={handlePayment}>
      <CreditCard size={17} />
      Start Settling
    </button>
  );
}
