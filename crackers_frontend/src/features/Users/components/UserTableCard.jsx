import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import CustomTable from "../../../shared/components/Table/Table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { userManagementTableData } from "../../../shared/constants/mockData/sample_table_data"; // Assuming your table data is here

function UserTableCard() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const tableName = userManagementTableData[0].title;
    const userTableHeaders = userManagementTableData[0].headers;

    const handleEdit = (item) => {
        console.log("Edit clicked for:", item.customerInfo.value.name.subValue);
    };

    const handleDelete = (id) => {
        console.log("Delete clicked for ID:", id);
    };

    // Add actions to sample data
    const usersWithActions = userManagementTableData[0].data.map((item) => {
        const itemCopy = { ...item };
        itemCopy.actions = {
            type: "actions",
            value: {
                edit: {
                    subType: "Edit",
                    subValue: <FiEdit size={15} />,
                    action: () => handleEdit(item),
                },
                delete: {
                    subType: "Delete",
                    subValue: <FiTrash2 size={15} />,
                    action: () => handleDelete(item.customerInfo.value.id.subValue),
                },
            },
        };
        return itemCopy;
    });

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setUsers(usersWithActions);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <TitleCard
                        heading="System Users"
                        tagline="All users with their roles and permissions"
                        variant="cardArea"
                    />
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName={tableName}
                        tableHeaders={userTableHeaders}
                        tableData={users}
                        currentItems={users}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        loading={loading}
                        rowsPerPage={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default UserTableCard;
