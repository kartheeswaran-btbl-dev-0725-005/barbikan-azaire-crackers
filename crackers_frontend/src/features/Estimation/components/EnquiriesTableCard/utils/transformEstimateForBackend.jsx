export const transformEstimateForBackend = (estimate) => ({
    name: estimate.customer_name,
    phone: estimate.phone,
    email: estimate.email,
    address: estimate.address,
    state: estimate.state,
    city: estimate.city,
    postalCode: estimate.postal_code,
    message: estimate.message,
    priority: estimate.priority,
    status: estimate.status,
    notes: estimate.notes,
    totalPrice: Number(estimate.total_price),
    discount: Number(estimate.discount),
    totalAmount: Number(estimate.total_amount),
    productItems: estimate.items.map(item => ({
        product_id: item.product_id,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.subtotal),
    }))
});
