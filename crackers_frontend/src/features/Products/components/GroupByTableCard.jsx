import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardContent,
} from '../../../shared/components/ui/Card';
import TitleCard from '../../../shared/components/ui/TitleCard';
import Button from '../../../shared/components/ui/Button';
import DropDown from '../../../shared/components/ui/DropDown';
import CustomTable from '../../../shared/components/Table/Table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Modal from '../../../shared/components/ui/Modal';
import { groupByFields, groupByTableHeaders } from '../constants/data'; // ✅ new constants
import apiClient, { getSession } from '@/shared/utils/apiClient';
import { usePagination } from '../../../shared/hooks/usePagination';
import { normalizeString } from '../../../shared/utils/helperFunctions';

function GroupByTableCard() {
	const [groupByList, setGroupByList] = useState([]);
	const [editingItem, setEditingItem] = useState(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState('All Status');
	const [totalItems, setTotalItems] = useState(0);

	const {
		currentPage,
		rowsPerPage,
		totalPages,
		handlePageChange,
		handleLimitChange,
		scrollRef,
	} = usePagination('groupByTable', totalItems);

	const fetchGroupBy = async () => {
		try {
			setLoading(true);
			const session = getSession();
			if (!session) return;

			const response = await apiClient.get(
				`/group-by/${session.tenantId}/${session.organizationId}/lists`,
				{ params: { page: currentPage, limit: rowsPerPage } }
			);

			const { data, total_groupby } = response.data;
			setGroupByList(data || []);
			setTotalItems(total_groupby || 0);
		} catch (error) {
			console.error('❌ Error fetching group by:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchGroupBy();
	}, [currentPage, rowsPerPage]);

	const handleOpenModal = () => {
		setEditingItem(null);
		setOpen(true);
	};
	const handleCloseModal = () => setOpen(false);

	const handleEdit = (item) => {
		setEditingItem(item);
		setOpen(true);
	};

	const handleSubmit = async (formData) => {
		try {
			const session = getSession();
			if (!session) throw new Error('No session found');

			// 🔑 remap "name" → "groupBy"
			const payload = {
				groupBy: formData.name || formData.groupBy,
				description: formData.description || '',
				status: formData.status || 'active',
				id: formData.id,
			};

			if (formData.id) {
				// update
				await apiClient.put(
					`/group-by/${session.tenantId}/${session.organizationId}/${formData.id}/update`,
					payload
				);
			} else {
				// add
				await apiClient.post(
					`/group-by/${session.tenantId}/${session.organizationId}/add`,
					payload
				);
			}

			await fetchGroupBy();
			setOpen(false);
		} catch (error) {
			console.error('❌ Error saving group by:', error);
		}
	};

	const handleDelete = async (item) => {
		try {
			const session = getSession();
			if (!session) throw new Error('No session found');

			await apiClient.delete(
				`/group-by/${session.tenantId}/${session.organizationId}/${item.id}/delete`
			);
			await fetchGroupBy();
		} catch (error) {
			console.error('❌ Error deleting group by:', error);
		}
	};

	const handleStatusChange = async (item, newStatus) => {
		try {
			const session = getSession();
			await apiClient.put(
				`/group-by/${session.tenantId}/${session.organizationId}/${item.id}/update`,
				{ ...item, status: newStatus }
			);
			setGroupByList((prev) =>
				prev.map((gb) => (gb.id === item.id ? { ...gb, status: newStatus } : gb))
			);
		} catch (error) {
			console.error('❌ Error updating status:', error);
		}
	};

	const filteredList =
		statusFilter === 'All Status'
			? groupByList
			: groupByList.filter(
					(gb) => gb.status?.toLowerCase() === statusFilter.toLowerCase()
			  );

	const tableData = filteredList.map((item) => ({
		name: { type: 'string', value: item.groupBy || item.group_by }, // 👈 fixed
		description: { type: 'string', value: item.description },
		status: {
			type: 'status',
			value: normalizeString(item.status),
		},
		actions: {
			type: 'actions',
			value: {
				edit: {
					subType: 'Edit',
					subValue: <FiEdit size={15} />,
					action: () => handleEdit(item),
				},
				delete: {
					subType: 'Delete',
					subValue: <FiTrash2 size={15} />,
					action: () => handleDelete(item),
				},
			},
		},
	}));

	const modalFields = Object.keys(groupByFields).map((key) => ({
		name: key,
		...groupByFields[key],
	}));

	const statusOptions = ['All Status', 'Active', 'Inactive'];

	return (
		<div ref={scrollRef}>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between gap-4'>
					<TitleCard
						heading='Group By'
						tagline='Manage product groupings'
						variant='cardArea'
					/>
					<div className='flex items-center gap-2'>
						<DropDown
							value={statusFilter}
							onChange={setStatusFilter}
							options={statusOptions}
							position='top'
						/>
						<Button
							variant='themeContrast'
							customStyle='flex items-center gap-2'
							onClick={handleOpenModal}
						>
							<FaPlus /> Add Group By
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<CustomTable
						tableName='Group By'
						tableHeaders={groupByTableHeaders}
						tableData={tableData}
						loading={loading}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						rowsPerPage={rowsPerPage}
						onLimitChange={handleLimitChange}
						onStatusChange={handleStatusChange}
					/>
				</CardContent>
			</Card>

			<Modal
				open={open}
				onClose={handleCloseModal}
				title={!editingItem ? 'Add New Group By' : 'Edit Group By'}
				subHeading={
					!editingItem ? 'Create a new group by' : 'Edit your existing group by'
				}
				onSubmit={handleSubmit}
				fields={modalFields}
				values={editingItem ? editingItem : {}}
				toggleData={[]}
				buttonText={!editingItem ? 'Add Group By' : 'Update Group By'}
			/>
		</div>
	);
}

export default GroupByTableCard;
