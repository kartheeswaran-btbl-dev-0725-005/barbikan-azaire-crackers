exports.PaymentMethodDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		type: req.body?.type || '', // 'BANK_TRANSFER' or 'UPI'
		account_owner: req.body?.accountOwner || '',
		phone_number: req.body?.phoneNumber || '',
		bank_name: req.body?.bankName || null,

		account_number: req.body?.accountNumber || null,
		ifsc_code: req.body?.ifscCode || null,

		// UPI-specific fields
		upi_id: req.body?.upiId || null,
		qr_code: req.file?.filename || null, // 👈 use req.file for single upload
	};
};
