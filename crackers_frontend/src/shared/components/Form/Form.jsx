import DynamicFields from "./DynamicFields";

function Form({ id, onSubmit, formData, values, handleChange }) {
    // Normalize fields into array
    const fields = Array.isArray(formData)
        ? formData
        : Object.keys(formData).map((key) => ({
            name: key,
            ...formData[key],
        }));

    const isTwoColumn = fields.length > 6;

    return (
        <form id={id} onSubmit={onSubmit} className="flex flex-col h-full gap-4">
            <div
                className={`grid gap-4 ${isTwoColumn ? "grid-cols-2" : "grid-cols-1"
                    }`}
            >
                {fields.map((field) => (
                    <DynamicFields
                        key={field.name}
                        fieldKey={field.name}
                        type={field.type}
                        config={field}
                        value={values?.[field.name] || ""}
                        onChange={handleChange}
                    />
                ))}
            </div>
        </form>
    );
}

export default Form;
