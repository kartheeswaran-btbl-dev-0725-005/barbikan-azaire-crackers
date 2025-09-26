import {
	Card,
	CardHeader,
	CardContent,
} from '../../../../shared/components/ui/Card';
import { FiDownload } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';
import TitleCard from '../../../../shared/components/ui/TitleCard';

function TopItemsCard({ item, heading, tagline }) {
	return (
		<Card key={'Title'}>
			<CardHeader className='flex-col items-start'>
				<div className='flex w-full justify-between items-center'>
					<TitleCard heading={heading} tagline={tagline} variant='cardArea' />
					<Button
						customStyle='flex justify-center items-center gap-2'
						variant='themeInverted'
					>
						<FiDownload size={15} /> <p>Export</p>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-3.5'>
					{item && item.length > 0 ? (
						item.map((order, index) => (
							<div key={order.type} className='flex items-center justify-between'>
								<div className='flex items-center space-x-3'>
									<span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm'>
										{index + 1}
									</span>
									<div>
										<p className='font-medium text-sm'>{order.product}</p>
										<div className='flex items-center text-[12px] text-muted-foreground'>
											<p style={{ color: 'var(--color-muted)' }}>{order.type}</p>
										</div>
									</div>
								</div>
								<div className='text-right'>
									<p className='font-medium text-sm'>{order.amount}</p>
									<div className='flex items-center text-[12px] text-muted-foreground'>
										<p style={{ color: 'var(--color-muted)' }}>{order.units} units</p>
									</div>
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

export default TopItemsCard;
