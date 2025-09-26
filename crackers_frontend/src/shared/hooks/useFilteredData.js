import { useMemo } from "react";

/**
 * useFilteredData
 * 
 * @param {Array} data - The dataset to filter
 * @param {Object} options
 * @param {string} options.statusKey
 * @param {string} options.categoryKey
 * @param {string} options.nameKey
 * @param {string} options.statusFilter
 * @param {string} options.categoryFilter
 * @param {string} options.searchText
 * @param {Function} options.statusMatchFn - Function to check if an item matches the status filter
 * @param {Function} options.categoryMatchFn - Function to check if an item matches the category filter
 */

export function useFilteredData(
    data,
    {
        statusKey,
        categoryKey,
        nameKey,
        statusFilter,
        categoryFilter,
        searchText,
        statusMatchFn,
        categoryMatchFn,
        nameExtractor
    }
) {
    function getNestedValue(obj, keyPath) {
        if (!obj || typeof obj !== "object" || !keyPath || typeof keyPath !== "string") {
            return null;
        }
        const keys = keyPath.split(".");
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }
        return value;
    }

    function searchByKey(item, key, query) {
        if (!query) return true;
        let raw = nameExtractor
            ? nameExtractor(item)
            : getNestedValue(item, key);

        // Handle objects with .value / .subValue or plain strings/numbers
        let value =
            typeof raw === "object" && raw !== null
                ? raw.subValue || raw.value || ""
                : raw || "";

        return value.toString().toLowerCase().includes(query.toLowerCase());
    }


    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const statusValue = (getNestedValue(item, statusKey)?.value || "").toString().toLowerCase();
            const categoryObj = getNestedValue(item, categoryKey);
            const categoryValue =
                typeof categoryObj?.value === "string"
                    ? categoryObj.value
                    : categoryObj?.value?.name?.subValue || "";


            // Status filter check
            const matchesStatus =
                !statusFilter || statusFilter.toLowerCase() === "all"
                    ? true
                    : statusMatchFn
                        ? statusMatchFn(statusValue, statusFilter)
                        : statusValue === statusFilter.toLowerCase();

            // Category filter check
            const matchesCategory =
                !categoryFilter || categoryFilter.toLowerCase() === "all"
                    ? true
                    : categoryMatchFn
                        ? categoryMatchFn(categoryValue, categoryFilter)
                        : categoryValue === categoryFilter.toLowerCase();

            // Search check
            const matchesSearch = searchByKey(item, nameKey, searchText);

            return matchesStatus && matchesCategory && matchesSearch;
        });
    }, [
        data,
        statusKey,
        categoryKey,
        nameKey,
        statusFilter,
        categoryFilter,
        searchText,
        statusMatchFn,
        categoryMatchFn,
        nameExtractor
    ]);

    return filteredData;
}

