"use client";

import ProductForm from "@/components/ProductForm";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="pb-20">
            <ProductForm productId={id} />
        </div>
    );
}
