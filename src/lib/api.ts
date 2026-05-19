import { supabase } from "@/lib/supabase";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts;
  const h = new Headers(headers);
  h.set("Accept", "application/json");
  if (body !== undefined && !(body instanceof FormData)) {
    h.set("Content-Type", "application/json");
  }
  if (auth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: h,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    if (data && typeof data === "object" && "message" in data) {
      msg = String((data as { message: unknown }).message);
    }
    throw new ApiError(res.status, data, msg);
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
