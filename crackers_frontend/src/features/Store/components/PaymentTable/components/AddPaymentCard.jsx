import { FaPlus } from "react-icons/fa6";
import TitleCard from "../../../../../shared/components/ui/TitleCard";

const AddPaymentCard = ({ onClick, customStyle }) => {
  return (
    <button
      onClick={onClick}
      className={`${customStyle} border-1 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 
                text-gray-600 hover:bg-white transition-colors duration-300 cursor-pointer`}
      aria-label="Add new payment method"
    >
      <div className="bg-gray-200 p-4 rounded-full">
        <FaPlus size={24} />
      </div>
      <TitleCard
        heading="Add Payment Method"
        tagline="Add bank account or UPI ID to accept payments"
        variant="modalArea"
      />
    </button>
  );
};

export default AddPaymentCard;
