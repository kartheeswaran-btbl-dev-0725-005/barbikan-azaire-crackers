import { useEffect, useState } from 'react';
import Search from '../common/Search';
import { FaAngleDown } from 'react-icons/fa6';
import { LuPanelLeft } from 'react-icons/lu';
import { IoChevronForward } from 'react-icons/io5';
import { PiBell } from 'react-icons/pi';
import { LuMoon } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Header({ toggleSidebar }) {
	const selectedItem = useSelector((state) => state.layout.selectedItem);
	const [searchTerm, setSearchTerm] = useState('');
	const [companyName, setCompanyName] = useState('');

	const tenantId = localStorage.getItem('tenantId');
	const organizationId = localStorage.getItem('organizationId');
	const token = localStorage.getItem('accessToken');

	const fetchCompany = async () => {
		const response = await axios.get(
			`${
				import.meta.env.VITE_AZAIRE_SERVER
			}/organizations/${tenantId}/${organizationId}/list`,
			{
				headers: { Authorization: `Bearer ${token}` },
				withCredentials: true,
			}
		);
		const { data } = response.data;
		setCompanyName(data.organization_name);
	};

	useEffect(() => {
		fetchCompany();
	}, []);

	function truncatedCompanyName(companyName, maxLength = 28) {
		if (companyName.length <= maxLength) return companyName;

		const truncated = companyName.slice(0, maxLength);
		return truncated.trim() + '...';
	}

	return (
		<header className='flex justify-between items-center px-5 py-2 bg-white'>
			<h1 className='flex items-center gap-2 text-xs text-[#717182]'>
				<button
					onClick={toggleSidebar}
					className='text-base mr-2 p-1 text-black rounded-md hover:bg-gray-200 transition-all duration-200'
				>
					<LuPanelLeft />
				</button>
				<div className='flex items-end gap-2'>
					<p>Dashboard</p>
					<span>
						<IoChevronForward />
					</span>
					<p className='font-semibold text-black'>{selectedItem}</p>
				</div>
			</h1>
			<div className='flex items-center px-2 py-2 gap-8'>
				<span className='flex items-center gap-5 text-[#717182] text-xs'>
					{truncatedCompanyName(companyName)} <FaAngleDown />
				</span>
				<Search
					searchTerm={searchTerm}
					placeholder='Search...'
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button>
					<PiBell size={15} className='cursor-pointer' />
				</button>
				<button>
					<LuMoon size={15} className='cursor-pointer' />
				</button>
			</div>
		</header>
	);
}

export default Header;
