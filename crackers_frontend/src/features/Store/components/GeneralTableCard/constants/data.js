export const formData = {
    general_settings: {
        storeName: {
            label: 'Store Name',
            type: 'text',
            placeholder: 'e.g., MyShop Crackers',
            required: true,
        },
        storeDescription: {
            label: 'Store Description',
            type: 'textarea',
            placeholder: 'Briefly describe your store (e.g., We sell standard crackers)',
        },
        minimumOrderValue: {
            label: 'Minimum Order Value (₹)',
            type: 'number',
            placeholder: 'e.g., 500',
            required: true,
        },
        phone: {
            label: 'Phone Number',
            type: 'number',
            placeholder: 'e.g., +91 9876543210',
            required: true,
        },
        email: {
            label: 'Email',
            type: 'email',
            placeholder: 'e.g., support@myshop.com',
        },
        addressLine1: {
            label: 'Address',
            type: 'textarea',
            placeholder: 'e.g., 123 Main Street, Gandhi Nagar',
        },
        addressLine2: {
            label: 'Landmark',
            type: 'text',
            placeholder: 'e.g., Near Central Mall',
        },
        city: {
            label: 'City',
            type: 'text',
            placeholder: 'e.g., Chennai',
        },
        state: {
            label: 'State',
            type: 'text',
            placeholder: 'e.g., Tamil Nadu',
        },
        postalCode: {
            label: 'Postal Code',
            type: 'number',
            placeholder: 'e.g., 600001',
        },
        country: {
            label: 'Country',
            type: 'text',
            placeholder: 'e.g., India',
        },
    },
};
