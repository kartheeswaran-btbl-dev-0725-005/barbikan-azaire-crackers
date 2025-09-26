import { RxUpload } from "react-icons/rx";
import DropDown from "../ui/DropDown";
import { useState, useEffect } from "react";

const BaseInput = ({ id, type = "text", config, extraClass, value, onChange }) => (
    <>
        {config.label && (
            <label htmlFor={id} className="block text-xs font-medium mb-1">
                {config.label} <span className="text-red-700">{config.required ? "*" : ""}</span>
            </label>
        )}
        <input
            id={id}
            name={id}
            type={type}
            placeholder={config.placeholder}
            required={config.required}
            className={`w-full rounded-md bg-gray-100 px-3 py-2 text-xs ${extraClass}`}
            value={value}
            onChange={onChange}
        />
    </>
);

const fieldRenderers = {
    text: (key, config, value, onChange) => (
        <BaseInput id={key} type="text" config={config} value={value} onChange={onChange} />
    ),
    email: (key, config, value, onChange) => (
        <BaseInput id={key} type="email" config={config} value={value} onChange={onChange} />
    ),
    password: (key, config, value, onChange) => (
        <BaseInput id={key} type="password" config={config} value={value} onChange={onChange} />
    ),
    date: (key, config, value, onChange) => (
        <BaseInput id={key} type="date" config={config} value={value} onChange={onChange} />
    ),
    number: (key, config, value, onChange) => (
        <BaseInput id={key} type="number" config={config} value={value} onChange={onChange} />
    ),
    tel: (key, config, value, onChange) => (
        <BaseInput id={key} type="tel" config={config} value={value} onChange={onChange} />
    ),
    select: (key, config, value, onChange, options) => (
        <DropDown
            id={key}
            label={config.label}
            value={value}
            onChange={onChange}
            options={options}
            placeholder={config.placeholder}
        />
    ),
    textarea: (key, config, value, onChange) => (
        <>
            {config.label && (
                <label htmlFor={key} className="block text-xs font-medium mb-1">
                    {config.label} <span className="text-red-700">{config.required ? "*" : ""}</span>
                </label>
            )}
            <textarea
                id={key}
                name={key}
                placeholder={config.placeholder}
                required={config.required}
                className="w-full rounded-md bg-gray-100 px-3 py-2 text-xs"
                value={value}
                onChange={onChange}
            />
        </>
    ),
    file: (key, config, value, onChange) => {
        const [preview, setPreview] = useState(value || null);

        useEffect(() => {
            if (value) {
                if (value instanceof File) {
                    setPreview(URL.createObjectURL(value));
                } else if (typeof value === "string") {
                    setPreview(value); // URL for existing image
                }
            }
        }, [value]);

        const handleFileChange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                setPreview(URL.createObjectURL(file));
                onChange({ target: { name: key, value: file, files: [file] } });
            }
        };

        return (
            <div>
                {config.label && (
                    <>
                        <label htmlFor={key} className="block text-xs font-medium mb-1">
                            {config.label} <span className="text-red-700">{config.required ? "*" : ""}</span>
                        </label>
                        <label
                            htmlFor={key}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-xs cursor-pointer"
                            style={{ color: "var(--color-muted)" }}
                        >
                            <RxUpload size={15} />
                            {config.placeholder}
                        </label>
                    </>
                )}
                <input
                    id={key}
                    name={key}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={config.required && !value}
                />
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded-md"
                    />
                )}
            </div>
        );
    }
};

function DynamicFields({ type, fieldKey, config, value, onChange }) {
    const renderer = fieldRenderers[type] || fieldRenderers["text"];

    const handleChange = (eOrValue) => {
        if (typeof eOrValue === "object" && eOrValue?.target) {
            // input/textarea/file already give an event
            onChange(eOrValue);
        } else {
            // dropdown gives just the selected value (e.g. "active")
            onChange({ target: { name: fieldKey, value: eOrValue } });
        }
    };

    return <div>{renderer(fieldKey, config, value, handleChange, config?.options)}</div>;
}

export default DynamicFields;
