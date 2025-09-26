import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '../../../shared/components/ui/Card';

function RecentOrders({ ordersData }) {
	const getStatusClasses = (status) => {
		switch (status.toLowerCase()) {
			case 'completed':
			case 'paid':
				return 'bg-green-700';
			case 'processing':
				return 'bg-yellow-500';
			case 'cancelled':
				return 'bg-red-700';
			default:
				return 'bg-gray-700';
		}
	};

	return (
		<Card>
			<CardHeader className='flex-col'>
				<CardTitle className='text-sm'>Recent Orders</CardTitle>
				<CardDescription className='text-sm'>
					Latest customer orders and their status
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{ordersData && ordersData.length > 0 ? (
						ordersData.map((order) => (
							<div key={order.id} className='flex items-center justify-between'>
								<div className='space-y-1'>
									<p className='text-xs font-medium'>{order.customer_name}</p>
									<p className='text-[10px]' style={{ color: 'var(--color-muted)' }}>
										{order.estimate_code} • {order.created_at}
									</p>
								</div>
								<div className='text-right'>
									<p className='text-xs font-medium'>
										₹{Number(order.amount).toLocaleString()}
									</p>
									<span
										className={`inline-flex items-center justify-center w-17 text-center px-2 py-0.5 text-[10px] text-white font-semibold rounded-md ${getStatusClasses(
											order.status
										)}`}
									>
										{order.status}
									</span>
								</div>
							</div>
						))
					) : (
						<p style={{ color: 'var(--color-muted)' }}>No recent orders</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default RecentOrders;
