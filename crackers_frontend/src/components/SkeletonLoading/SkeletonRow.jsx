function SkeletonRow({ columns }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, idx) => (
                <td key={idx} className="p-4">
                    {
                        (idx === 0 || idx === 1) ? (
                            <div className="flex flex-col gap-2">
                                <div className="h-2 bg-gray-300 rounded w-full"></div>
                                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ) : (
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        )
                    }

                </td>
            ))}
        </tr>
    );
}

export default SkeletonRow