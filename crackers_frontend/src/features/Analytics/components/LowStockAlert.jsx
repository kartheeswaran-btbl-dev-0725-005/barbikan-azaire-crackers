import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '../../../shared/components/ui/Card';
import { FiAlertTriangle } from 'react-icons/fi';
import { BsBoxes } from 'react-icons/bs';
import Button from '../../../shared/components/ui/Button';

function LowStockAlert({ lowStackData }) {
	return (
		<Card>
			<CardHeader className='flex-col'>
				<CardTitle className='flex items-center gap-2 text-sm'>
					<FiAlertTriangle className='h-4 w-4 text-orange-500' />
					Low Stock Alert
				</CardTitle>
				<CardDescription>Items that need immediate restocking</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-5 justify-between h-full'>
				<div className='space-y-4'>
					{lowStackData && lowStackData.length > 0 ? (
						lowStackData.map((item, index) => (
							<div key={index} className='flex items-center justify-between'>
								<div>
									<p className='text-xs font-medium'>{item.product_name}</p>
									<p className='text-[10px]' style={{ color: 'var(--color-muted)' }}>
										Current: {item.current} | Min: {item.min}
									</p>
								</div>
								<span className='inline-block text-[10px] font-semibold text-white bg-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-md'>
									{item.status}
								</span>
							</div>
						))
					) : (
						<p>No low stock items</p>
					)}
				</div>

				<Button
					customStyle='w-full flex justify-center items-center gap-4'
					variant='themeInverted'
				>
					<BsBoxes size={15} /> <p>Manage Stock</p>
				</Button>
			</CardContent>
		</Card>
	);
}

export default LowStockAlert;
