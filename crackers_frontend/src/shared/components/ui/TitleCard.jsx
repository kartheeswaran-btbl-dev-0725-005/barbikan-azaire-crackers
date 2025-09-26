function TitleCard({ heading, tagline, variant, icon, customStyles = {} }) {
    // This component renders a title card with a heading and tagline.
    const variantStyles = {
        dashboardSection: {
            containerClass: "flex flex-col",
            titleClass: "text-[26px] font-bold text-primary",
            taglineClass: "text-sm text-muted",
            iconClass: "",
        },
        cardArea: {
            containerClass: "flex flex-col",
            titleClass: "text-base font-medium text-primary",
            taglineClass: "text-sm text-muted",
            iconClass: "",
        },
        gridCardArea: {
            containerClass: "flex flex-col",
            titleClass: "text-sm font-medium text-primary",
            taglineClass: "text-[10px] text-muted",
            iconClass: "",
        },
        modalArea: {
            containerClass: "flex flex-col",
            titleClass: "text-sm font-medium text-primary",
            taglineClass: "text-xs mt-1 mb-4 text-muted",
            iconClass: "",
        },
        gridCardAreaReverse: {
            containerClass: "flex flex-col",
            titleClass: "text-[10px] text-muted",
            taglineClass: "text-sm font-medium text-primary mt-1",
            iconClass: "",
        }
    };

    const selectedVariant = variantStyles[variant] || variantStyles.cardArea;

    // Merge styles by appending instead of replacing
    const mergedTitleCardStyles = {
        containerClass: `${selectedVariant.containerClass} ${customStyles.containerClass || ""}`,
        titleClass: `${selectedVariant.titleClass} ${customStyles.titleClass || ""}`,
        taglineClass: `${selectedVariant.taglineClass} ${customStyles.taglineClass || ""}`,
        iconClass: `${selectedVariant.iconClass} ${customStyles.iconClass || ""}`,
    };

    return (
        <div className={mergedTitleCardStyles.containerClass}>
            {icon ? <span className={mergedTitleCardStyles.iconClass}>{icon}</span> : null}
            <div className="flex flex-col">
                <h1 className={mergedTitleCardStyles.titleClass}>
                    {heading}
                </h1>
                <p className={mergedTitleCardStyles.taglineClass}>
                    {tagline}
                </p>
            </div>
        </div>
    );
}

export default TitleCard;
