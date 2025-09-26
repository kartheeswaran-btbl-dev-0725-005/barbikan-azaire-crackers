import SkeletonRow from '@/components/SkeletonLoading/SkeletonRow';
import Pagination from './Pagination';
import ToggleButton from '../ui/ToggleButton';

function CustomTable(props) {
    const {
        tableHeaders,
        tableData,
        loading,
        currentPage,
        rowsPerPage,
        onLimitChange,
        totalPages,
        onPageChange,
    } = props;

    return (
        <div>
            {rowsPerPage &&
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                    customStyle="mb-4"
                    position="top"
                />
            }

            <table className="min-w-full">
                <thead>
                    <tr className="text-xs text-left" style={{ color: "var(--color-primary)" }}>
                        {tableHeaders.map((header) => (
                            <th
                                key={header.key}
                                className={`p-3 font-medium ${header.label == "Actions" ? "text-center" : ""}`}
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <SkeletonRow key={i} columns={tableHeaders.length} />
                        ))
                    ) : (
                        tableData.map((item, index) => (
                            <tr key={index} className="text-xs border-t border-gray-200">
                                {Object.entries(item).map(([key, field]) => {
                                    if (field.type === "object") {
                                        const { emoji, images, ...fieldValues } = field.value;

                                        return (
                                            <td key={key} className='px-1 py-3'>
                                                <div className='flex gap-2 items-start'>
                                                    {/* ✅ Render top-level image if available, else emoji */}
                                                    {images ? (
                                                        <div className={field.customStyle}>
                                                            <img
                                                                src={images}
                                                                alt="Product"
                                                                className="w-8 h-8 object-cover rounded-md"
                                                            />
                                                        </div>
                                                    ) : emoji ? (
                                                        <div className={field.customStyle}>{emoji}</div>
                                                    ) : null}

                                                    <div>
                                                        {Object.entries(fieldValues).map(([subKey, subField]) => {
                                                            const { emoji, images, subValue } = subField;

                                                            return (
                                                                <p
                                                                    key={subKey}
                                                                    className={subKey === 'id' ? 'text-gray-500' : ''}
                                                                >
                                                                    {/* ✅ SubField: render image if present, else emoji, then text */}
                                                                    {images ? (
                                                                        <span className="inline-block mr-1 align-middle">
                                                                            <img
                                                                                src={images}
                                                                                alt="icon"
                                                                                className="w-4 h-4 object-cover inline-block rounded-sm"
                                                                            />
                                                                        </span>
                                                                    ) : emoji ? (
                                                                        <span className="inline-block mr-1 align-middle">
                                                                            {emoji}
                                                                        </span>
                                                                    ) : null}

                                                                    <span className="align-middle">{subValue}</span>
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    }
                                    else if (field.type === 'actions') {
                                        return (
                                            <td key={key} className='p-3'>
                                                <div className='flex justify-center gap-2'>
                                                    {Object.entries(field.value).map(([actionKey, actionData]) => (
                                                        <button
                                                            key={actionKey}
                                                            className='p-2 hover:bg-gray-100 rounded-full'
                                                            onClick={() => actionData.action(item)}
                                                            title={actionData.subType}
                                                        >
                                                            {actionData.subValue}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td key={key} className='p-3'>
                                                {key === 'status' &&
                                                    (field.value === 'Available' || field.value === 'Out of stock') ? (
                                                    <ToggleButton
                                                        value={field.value === 'Available'}
                                                        onToggle={(newState) => {
                                                            const newStatus = newState ? 'Available' : 'Out of stock';
                                                            if (props.onStatusChange) {
                                                                props.onStatusChange(item, newStatus);
                                                            }
                                                        }}
                                                    />
                                                ) : (field.customStyle || field.currency) ? (
                                                    <span className={field.customStyle}>
                                                        {field.currency
                                                            ? `${field.currency}${!isNaN(field.value) && field.value !== ""
                                                                ? Number(field.value).toLocaleString("en-IN", {
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : field.value
                                                            }`
                                                            : !isNaN(field.value) && field.value !== ""
                                                                ? Number(field.value).toLocaleString("en-IN", {
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : field.value}
                                                    </span>
                                                ) : (
                                                    field.value
                                                )}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ))
                    )}

                    {!loading && tableData.length === 0 && (
                        <tr>
                            <td
                                colSpan={tableHeaders.length}
                                className='p-4 text-center text-gray-400'
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {tableData.length >= 10 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                    customStyle="mt-8"
                    position="bottom"
                />
            )}
        </div>
    );
}

export default CustomTable;
