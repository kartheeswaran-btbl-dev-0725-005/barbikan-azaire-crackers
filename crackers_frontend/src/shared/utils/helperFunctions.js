function flattenObject(obj, parentKey = "", result = {}) {
    for (const key in obj) {
        const fullKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], fullKey, result);
        } else {
            result[fullKey] = obj[key];
        }
    }
    return result;
}

function normalizeString(data) {
    if (!data) return "";

    //Convert to snake_case if the value is a camelCase
    const snakeCase = data.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();


    return snakeCase
        .split(/[_\s]+/)
        .filter(Boolean)
        .map((word) => {
            if (["upi", "ifsc", "qr", "id"].includes(word)) {
                return word.toUpperCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

const toCamelCase = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = obj[key];
        return acc;
    }, {});
};

const toSnakeCase = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        acc[snakeKey] = obj[key];
        return acc;
    }, {});
};



export { flattenObject, normalizeString, toCamelCase, toSnakeCase }