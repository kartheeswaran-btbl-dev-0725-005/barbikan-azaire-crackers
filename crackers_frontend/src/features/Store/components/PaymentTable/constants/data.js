const personalDetails = {
    account_owner: {
        label: "Account Owner",
        type: "text",
        placeholder: "Enter account owner name",
        required: true,
    },
    phone_number: {
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
    },
    bank_name: {
        label: "Bank Name",
        type: "text",
        placeholder: "Enter bank name",
        required: true,
    },
};

const modalData = {
    bank_transfer: {
        ...personalDetails,
        account_number: {
            label: "Account Number",
            type: "text",
            placeholder: "Enter account number",
            required: true,
        },
        ifsc_code: {
            label: "IFSC Code",
            type: "text",
            placeholder: "Enter IFSC code",
            required: true,
        },
    },
    upi_payment: {
        ...personalDetails,
        upi_id: {
            label: "UPI ID",
            type: "text",
            placeholder: "Enter UPI ID",
            required: true,
        },
        qr_code: {
            label: "QR Code",
            type: "file",
            placeholder: "Upload your QR code image",
            required: false,
        },
    },
};

export { modalData }