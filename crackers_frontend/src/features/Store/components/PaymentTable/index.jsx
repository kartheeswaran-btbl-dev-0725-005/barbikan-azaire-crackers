import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Card,
	CardHeader,
	CardContent,
} from '../../../../shared/components/ui/Card';
import { normalizeString } from '../../../../shared/utils/helperFunctions';
import { addPaymentMethod } from '../../../../app/slices/paymentSlice';
import { LuBuilding2 } from 'react-icons/lu';
import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2';
import { modalData } from './constants/data';
import TitleCard from '../../../../shared/components/ui/TitleCard';
import AddPaymentCard from './components/AddPaymentCard';
import Modal from '../../../../shared/components/ui/Modal';
import CopyText from '../../../../shared/components/common/CopyText';

function PaymentTableCard() {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const paymentMethods = useSelector((state) => state.payments.methods);
	console.log('Payment Methods:', paymentMethods);

	const handleOpenModal = () => setOpen(true);
	const handleCloseModal = () => setOpen(false);

	const handleSubmit = (type, values) => {
		dispatch(addPaymentMethod(type, values));
		handleCloseModal();
	};

	return (
		<div>
			<div className='flex items-center justify-between my-4'>
				<TitleCard
					heading='Payment Information'
					tagline='Configure payment methods and information'
					variant='cardArea'
				/>
			</div>
			<div className='w-full'>
				{paymentMethods.length === 0 ? (
					<AddPaymentCard onClick={handleOpenModal} customStyle='w-1/4' />
				) : (
					<div className='grid grid-cols-1 md:grid-cols-3 gap-5 my-5'>
						{paymentMethods.map((card, index) => {
							const heading = normalizeString(card.type) || 'N/A';
							const tagline =
								heading === 'Bank Transfer'
									? 'Secure payments from your bank'
									: heading === 'UPI Payment'
										? 'Instant digital payments'
										: '';
							const paymentMethodIndicatorIcon =
								heading === 'Bank Transfer' ? (
									<LuBuilding2 size={20} />
								) : heading === 'UPI Payment' ? (
									<HiOutlineDevicePhoneMobile size={20} />
								) : (
									''
								);

							return (
								<Card
									key={index}
									className='p-3 items-center group relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 
										via-white to-stone-50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
								>
									<div className='absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-stone-500/5' />
									<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/8 to-transparent rounded-full -translate-y-16 translate-x-16' />
									<div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-stone-400/8 to-transparent rounded-full translate-y-12 -translate-x-12' />

									<CardHeader className='font-semibold pb-3 pt-3 pl-2 w-full'>
										<TitleCard
											heading={heading}
											tagline={tagline}
											icon={paymentMethodIndicatorIcon}
											variant='gridCardArea'
											customStyles={{
												containerClass: 'flex items-center gap-2',
												titleClass: 'flex items-center gap-2',
												iconClass: 'flex items-center bg-black text-white p-2.5 rounded-xl',
											}}
										/>
									</CardHeader>

									<CardContent className='flex flex-col text-xs gap-4 pt-2 pb-2 pr-2 pl-2 w-full'>
										{Object.entries(card.values).map(([key, value], idx) => (
											<Card
												key={idx}
												className='flex flex-row items-center justify-between px-3 py-2'
											>
												<TitleCard
													heading={`${normalizeString(key)}:` || 'N/A'}
													tagline={value || 'N/A'}
													variant='gridCardAreaReverse'
												/>
												<CopyText textToCopy={value || 'N/A'} />
											</Card>
										))}
									</CardContent>
								</Card>
							);
						})}

						<AddPaymentCard onClick={handleOpenModal} />
					</div>
				)}
			</div>
			<Modal
				open={open}
				onClose={handleCloseModal}
				title='Add Payment Method'
				subHeading='Fill out the details for the new payment method'
				onSubmit={handleSubmit}
				fields={modalData}
				toggleData={['Bank Transfer', 'UPI Payment']}
				buttonText='Create Payment Method'
			/>
		</div>
	);
}

export default PaymentTableCard;
