import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";

function CopyText({ textToCopy }) {
    const [copied, setCopied] = useState(false);
    console.log(textToCopy);


    const handleCopy = (e) => {
        e.preventDefault();
        console.log("hi");

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="z-10 cursor-pointer"
            title={copied ? "Copied!" : "Copy"}
        >
            {copied ? (
                <FaRegCircleCheck className="text-green-500" size={15} />
            ) : (
                <FiCopy className="text-gray-500" size={15} />
            )}
        </button>
    )
}

export default CopyText