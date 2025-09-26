function Button({
  variant,
  children,
  isSelected,
  onClick,
  customStyle = "",
  buttonType = "button",
  formId,
}) {
  // This component renders a button with different styles based on the variant and selection state.
  // It supports custom styles and handles click events.

  const finalVariant =
    variant === "manualToggle"
      ? isSelected
        ? "themeContrast"
        : "themeInverted"
      : variant;

  const baseClass =
    "text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors duration-300 cursor-pointer";

  const variantClasses = {
    themeInverted:
      "bg-white text-[var(--color-primary)] hover:text-dark border-gray-200 hover:bg-gray-100",
    themeContrast:
      "bg-[var(--color-button-bg)] text-white border-[var(--color-button-bg)]",
  };

  const className = `${baseClass} ${
    variantClasses[finalVariant] || ""
  } ${customStyle}`;

  return (
    <button
      className={className}
      onClick={onClick}
      type={buttonType}
      form={formId}
    >
      {children}
    </button>
  );
}

export default Button;
