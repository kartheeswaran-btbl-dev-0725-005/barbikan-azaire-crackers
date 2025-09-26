import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SideBar from '@/shared/components/ui/SideBar';
import Header from '@/shared/components/ui/Header';
import Analytics from '@/features/Analytics';
import CustomerManagement from '@/features/Customers';
import ProductManagement from '@/features/Products';
import StockManagement from '@/features/Stocks';
import Quotation from '@/features/Quotation';
import Sales from '@/features/Sales';
import OnlineEstimation from '@/features/Estimation';
import Reports from '@/features/Reports';
import StoreSettings from '@/features/Store';
import UserManagement from '@/features/Users';
import Help from '@/features/Support';
import ScrollToTopButton from '@/shared/components/common/ScrollToTopButton';
import axios from 'axios';

function Dashboard() {
	const selectedItem = useSelector((state) => state.layout.selectedItem);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const scrollRef = useRef(null);
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);

		const tenantIdFromUrl = query.get('tenantId');
		const accessTokenFromUrl = query.get('accessToken');
		const nameFromUrl = query.get('name');
		const organizationIdFromUrl = query.get('organizationId');

		// ✅ Store query params if present
		if (tenantIdFromUrl) localStorage.setItem('tenantId', tenantIdFromUrl);
		if (accessTokenFromUrl)
			localStorage.setItem('accessToken', accessTokenFromUrl);
		if (nameFromUrl) localStorage.setItem('name', nameFromUrl);
		if (organizationIdFromUrl)
			localStorage.setItem('organizationId', organizationIdFromUrl);

		// ✅ Clean the URL to remove all query params, even if some are missing
		if (window.location.search) {
			const cleanUrl = window.location.pathname; // keeps only /dashboard or current path
			window.history.replaceState({}, document.title, cleanUrl);
		}

		const checkAuth = () => {
			const tenantId = localStorage.getItem('tenantId');
			const organizationId = localStorage.getItem('organizationId');
			const token = localStorage.getItem('accessToken');

			if (!tenantId || !token) {
				window.location.href = `${import.meta.env.VITE_AZAIRE_DOMAIN}/signin`;
				return null;
			}
			return { tenantId, organizationId, token };
		};

		const validateTenantAndOrg = async () => {
			const session = checkAuth();
			if (!session) return;

			// 🔍 Step 1: Validate Tenant
			try {
				const tenantCheck = await axios.get(
					`${import.meta.env.VITE_AZAIRE_SERVER}/tenants/${session.tenantId}/list`,
					{
						headers: { Authorization: `Bearer ${session.token}` },
						withCredentials: true,
					}
				);
				setUserName(tenantCheck?.data?.data?.name);
				setEmail(tenantCheck?.data?.data?.email);

			} catch (error) {
				console.log("Hi");
				if (error.status === 404) {
					window.location.href = `${import.meta.env.VITE_AZAIRE_DOMAIN}/signin`;
				}
				console.error(
					'❌ Tenant check failed:',
					error.response?.data || error.message
				);

				return;
			}

			// 🔍 Step 2: Validate Organizations
			let organizations = [];
			try {
				const orgListRes = await axios.get(
					`${import.meta.env.VITE_AZAIRE_SERVER}/organizations/${session.tenantId
					}/lists`,
					{
						headers: { Authorization: `Bearer ${session.token}` },
						withCredentials: true,
					}
				);
				organizations = orgListRes.data?.data || [];

				if (organizations.length === 0) {
					// No orgs → redirect to create org page
					const params = new URLSearchParams({
						tenantId: session.tenantId,
						accessToken: session.token,
					}).toString();

					window.location.href = `${import.meta.env.VITE_AZAIRE_DOMAIN
						}/organization/create?${params}`;
					return;
				}

				// ✅ Store first orgId
				const organization = organizations[0];
				const organizationId = organization?.organization_id;
				if (organizationId) {
					localStorage.setItem('organizationId', organizationId);
				} else {
					console.error('❌ No organization_id found in response:', organization);
					return;
				}
			} catch (error) {
				console.error(
					'❌ Organization fetch failed:',
					error.response?.data || error.message
				);
				return;
			}

			// 🔍 Step 3: Validate Organization in Platform (Azaire)
			const platformName = 'crackers';
			try {
				await axios.get(
					`${import.meta.env.VITE_AZAIRE_SERVER}/platforms/${platformName}/${session.tenantId
					}/${session.organizationId}/list`,
					{
						headers: { Authorization: `Bearer ${session.token}` },
						withCredentials: true,
					}
				);
				console.log('✅ Platform exists in Azaire');
			} catch (error) {
				if (error.response?.status === 404) {
					try {
						await axios.post(
							`${import.meta.env.VITE_AZAIRE_SERVER}/platforms/${platformName}/${session.tenantId
							}/${session.organizationId}/add`,
							{},
							{
								headers: { Authorization: `Bearer ${session.token}` },
								withCredentials: true,
							}
						);
						console.log('✅ Platform created in Azaire');
					} catch (postError) {
						console.error(
							'❌ Failed to create Platform in Azaire',
							postError.message
						);
					}
				} else {
					console.error('❌ Error validating Platform:', error.message);
				}
			}

			// 🔍 Step 4: Validate Organization in Crackers DB
			try {
				await axios.get(
					`${import.meta.env.VITE_CRACKERS_SERVER}/organizations/${session.tenantId
					}/${session.organizationId}/list`,
					{
						headers: { Authorization: `Bearer ${session.token}` },
						withCredentials: true,
					}
				);
				console.log('✅ Org exists in Crackers');
			} catch (error) {
				if (error.response?.status === 404) {
					try {
						await axios.post(
							`${import.meta.env.VITE_CRACKERS_SERVER}/organizations/${session.tenantId
							}/${session.organizationId}/add`,
							{},
							{
								headers: { Authorization: `Bearer ${session.token}` },
								withCredentials: true,
							}
						);
						console.log('✅ Organization created in Crackers');
					} catch (postError) {
						console.error(
							'❌ Failed to create organization in Crackers:',
							postError.message
						);
					}
				} else {
					console.error('❌ Error validating Crackers org:', error.message);
				}
			}
		};

		validateTenantAndOrg();

		const handleStorageChange = () => {
			checkAuth();
		};
		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);
		return () => clearTimeout(timer);
	}, [selectedItem]);

	function renderSection() {
		switch (selectedItem) {
			case 'Customer Management':
				return <CustomerManagement />;
			case 'Product Management':
				return <ProductManagement />;
			case 'Stock Management':
				return <StockManagement />;
			case 'Quotation':
				return <Quotation />;
			case 'Sales':
				return <Sales />;
			case 'Online Estimate':
				return <OnlineEstimation />;
			case 'Reports':
				return <Reports />;
			case 'Store Settings':
				return <StoreSettings />;
			case 'User Management':
				return <UserManagement />;
			case 'Support / Help':
				return <Help />;
			default:
				return <Analytics isLoading={isLoading} />;
		}
	}

	const handleToggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	return (
		<div className='relative flex max-h-screen overflow-hidden bg-[#f8f8f8]'>
			<SideBar isOpen={isSidebarOpen} userName={userName} email={email} />
			<section
				className={`
                    h-screen flex flex-col transition-[margin] duration-500 ease-in-out w-full
                    ${isSidebarOpen ? 'ml-60' : 'ml-0'}
                `}
				style={{ willChange: 'margin' }}
			>
				<Header toggleSidebar={handleToggleSidebar} isLoading={isLoading} />
				<div
					ref={scrollRef}
					className='w-full flex-1 overflow-y-auto min-h-[calc(100vh-70px)] p-5'
				>
					<div key={selectedItem}>{renderSection()}</div>
					<ScrollToTopButton scrollRef={scrollRef} />
				</div>
			</section>
		</div>
	);
}

export default Dashboard;
