exports.QuotationItemDTO = (item) => ({
	product_id: item?.productId || null,
	product_name: item?.productName?.trim() || '',
	price: item?.price || 0,
	quantity: item?.quantity || 0,
	total: item?.total || 0,
});
