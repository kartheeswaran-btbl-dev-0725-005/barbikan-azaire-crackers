import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import Form from "../../components/Form/Form";
import HeadingToggle from "../common/HeadingToggle";
import TitleCard from "./TitleCard";
import Button from "./Button";

function Modal({
    open,
    onClose,
    title,
    subHeading,
    onSubmit,
    fields,
    values = {},
    toggleData = [],
    buttonText,
}) {
    if (!open) return null;

    const hasToggle = toggleData && toggleData.length > 0;

    const [selectedMethod, setSelectedMethod] = useState(
        hasToggle ? toggleData[0] : "default"
    );
    const [formData, setFormData] = useState(values);

    function getModalData() {
        if (!fields) return [];

        if (hasToggle) {
            const key = selectedMethod.toLowerCase().split(" ").join("_");
            return fields[key] || [];
        }

        return fields;
    }

    const modalFields = getModalData();

    // Determine if two-column layout
    const isTwoColumn = modalFields.length > 6;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const missingRequired = modalFields.filter(
            (f) => f.required && (!formData[f.name] || formData[f.name] === "")
        );

        if (missingRequired.length > 0) {
            enqueueSnackbar("Please fill all required fields before submitting", {
                variant: "error",
            });
            return;
        }

        if (hasToggle) {
            const key = selectedMethod.toLowerCase().split(" ").join("_");
            onSubmit(key, formData);
        } else {
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setFormData({});
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs z-50">
            <div
                className={`bg-white rounded-lg shadow-lg w-full p-6 relative
                    ${isTwoColumn ? "max-w-xl" : "max-w-md"}`}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute px-2.5 py-1 rounded-full top-5 right-5 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                    ✕
                </button>

                {/* Title */}
                {title && (
                    <TitleCard
                        heading={title}
                        tagline={subHeading || "Fill out the form below"}
                        variant="modalArea"
                    />
                )}

                {/* Toggle */}
                {hasToggle && (
                    <HeadingToggle
                        toggleList={toggleData}
                        selectedOption={selectedMethod}
                        setSelectedOption={setSelectedMethod}
                        customStyle="mb-4"
                    />
                )}

                {/* Form */}
                <Form
                    id="modalForm"
                    onSubmit={handleSubmit}
                    formData={modalFields}
                    values={formData}
                    handleChange={handleChange}
                />

                {/* Submit */}
                <div className="flex justify-end mt-6">
                    <Button
                        variant="themeContrast"
                        buttonType="submit"
                        formId="modalForm"
                    >
                        {buttonText || "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
