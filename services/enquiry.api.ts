/**
 * Product Enquiry API - calls backend directly so requests are visible in Network tab
 */

export type ProductEnquiryPayload = {
  productId?: string;
  modelId?: string;
  productTitle?: string;
  modelName?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  productImageUrl?: string;
};

export type EnquiryResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

function getBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return String(url).replace(/\/$/, "");
}

export async function submitProductEnquiry(
  payload: ProductEnquiryPayload
): Promise<EnquiryResponse> {
  const apiBase = getBackendUrl();
  if (!apiBase) {
    return {
      success: false,
      error: "API not configured. Set NEXT_PUBLIC_API_BASE_URL in environment.",
    };
  }

  const body = {
    productId: payload.productId,
    modelId: payload.modelId,
    productTitle: payload.productTitle,
    modelName: payload.modelName,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    message: payload.message?.trim() || "",
    messageTitle: `Enquiry for ${payload.modelName || "Product"}`,
    enquiryType: "Product" as const,
    productImageUrl: payload.productImageUrl,
  };

  const url = `${apiBase}/api/contact/product-enquiry`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  const data: EnquiryResponse = await res.json().catch(() => ({
    success: false,
    error: "Invalid response from server",
  }));

  if (!res.ok) {
    return {
      success: false,
      error: data.error || data.message || "Failed to send enquiry",
    };
  }

  return data;
}
