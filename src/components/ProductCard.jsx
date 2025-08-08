import { useState, useMemo } from "react";

export const ProductCard = ({
    id,
    name,
    price,
    imageUrl,
    inStock,
    currency = "USD",
    onAddToCart,
    variants = [], // [{ id: string, label: string, disabled?: boolean }]
}) => {
    const priceLabel = useMemo(() => {
        try {
            return new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            }).format(price);
        } catch {
            return `$${Number(price).toFixed(2)}`;
        }
    }, [price, currency]);

    const [variantId, setVariantId] = useState(
        variants.find(v => !v.disabled)?.id ?? (variants[0]?.id ?? "")
    );
    const hasVariants = variants.length > 0;
    const ctaDisabled = !inStock || (hasVariants && !variantId);

    return (
        <div className="card h-100 shadow-sm border-0">
            {/* Image */}
            <div className="ratio ratio-4x3 bg-light">
                <img
                    src={imageUrl}
                    alt={name}
                    className="card-img-top"
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                />
            </div>

            {/* Body */}
            <div className="card-body d-flex flex-column">
                {/* Name */}
                <h5 className="card-title mb-2 text-truncate" title={name}>
                    {name}
                </h5>

                {/* Price & Availability */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-semibold">{priceLabel}</span>
                    {!inStock ? (
                        <span className="badge text-bg-secondary">Out of stock</span>
                    ) : (
                        <span className="badge text-bg-success">In stock</span>
                    )}
                </div>

                {/* Variant Dropdown (optional) */}
                {hasVariants && (
                    <div className="mb-3">
                        <label htmlFor={`variant-${id}`} className="form-label mb-1">
                            Variant
                        </label>
                        <select
                            id={`variant-${id}`}
                            className="form-select"
                            value={variantId}
                            onChange={(e) => setVariantId(e.target.value)}
                            disabled={!inStock}
                            aria-label="Choose a variant"
                        >
                            {variants.map((v) => (
                                <option key={v.id} value={v.id} disabled={v.disabled}>
                                    {v.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="mt-auto d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary w-50"
                        onClick={() => onAddToCart?.({ productId: id, variantId: hasVariants ? variantId : undefined })}
                        disabled={ctaDisabled}
                    >
                        {inStock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button
                        type="button"
                        className={`btn btn-outline-primary w-50 ${ctaDisabled ? "disabled" : ""}`}
                        onClick={() => !ctaDisabled && (window.location.href = `/product/${id}`)}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};
