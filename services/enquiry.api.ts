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

export type ContactEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  companyEmail?: string;
  companyLocation?: string;
  companyPhoneNumber?: string;
  messageTitle?: string;
  message: string;
};

export type AccessoryEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  productTitle?: string;
  productImageUrl?: string;
  productId?: string;
};

export type EnquiryResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

function getBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_CONTECT_URL || "";
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

export async function submitContactEnquiry(
  payload: ContactEnquiryPayload
): Promise<EnquiryResponse> {
  const apiBase = getBackendUrl();
  if (!apiBase) {
    return {
      success: false,
      error: "API not configured. Set NEXT_PUBLIC_API_BASE_URL in environment.",
    };
  }

  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    companyName: payload.companyName?.trim(),
    companyEmail: payload.companyEmail?.trim(),
    companyLocation: payload.companyLocation?.trim(),
    companyPhoneNumber: payload.companyPhoneNumber?.trim(),
    messageTitle: payload.messageTitle?.trim(),
    message: payload.message.trim(),
  };

  const url = `${apiBase}/api/contact/create`;
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

export async function submitAccessoryEnquiry(
  payload: AccessoryEnquiryPayload
): Promise<EnquiryResponse> {
  const apiBase = getBackendUrl();
  if (!apiBase) {
    return {
      success: false,
      error: "API not configured. Set NEXT_PUBLIC_API_BASE_URL in environment.",
    };
  }

  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    message: payload.message.trim(),
    productTitle: payload.productTitle,
    productImageUrl: payload.productImageUrl,
    productId: payload.productId,
  };

  const url = `${apiBase}/api/contact/accessory-enquiry`;
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
