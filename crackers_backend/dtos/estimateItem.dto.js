exports.EstimateItemDTO = (item) => ({
	product_id: item.product_id,
	name: item.name,
	quantity: item.quantity || 1,
	price: item.price || 0,
	subtotal: (item.quantity || 1) * (item.price || 0),
});
