const { QuotationItemDTO } = require('./quotationItem.dto');

exports.QuotationDTO = (req) => ({
	tenant_id: req.params?.tenantId || null,
	organization_id: req.params?.organizationId || null,
	quotation_id: req.body?.quotationId || null,
	customer_name: req.body?.customerName?.trim() || '',
	phone: req.body?.phone?.trim() || null,
	address: req.body?.address?.trim() || null,
	date: req.body?.date || null,
	valid_until: req.body?.validUntil || null,
	notes: req.body?.notes?.trim() || null,
	total_amount: req.body?.totalAmount || 0,
	items: req.body?.items?.map((item) => QuotationItemDTO(item)) || [],
});
