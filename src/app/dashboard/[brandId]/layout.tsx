"use client";

import { ReactNode, useEffect } from "react";
import { useParams } from "next/navigation";

import { setActiveBrand } from "@/store/feature/brandSlice";
import { useAppDispatch } from "@/hooks/redux-hooks";

export default function BrandLayout({ children }: { children: ReactNode }) {
  const { brandId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (brandId && typeof brandId === "string") {
      dispatch(setActiveBrand(brandId));
    }
  }, [brandId, dispatch]);

  return <>{children}</>; // ✅ no sidebar, just context
}
