import { API_BASE } from "../config/api.js";

const DEFAULT_TIMEOUT = 10_000; // ms

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function withTimeout(promise, timeout = DEFAULT_TIMEOUT) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), timeout);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const { timeout, ...fetchOpts } = opts;

  const res = await withTimeout(fetch(url, fetchOpts), timeout ?? DEFAULT_TIMEOUT);

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (_) { body = await res.text().catch(() => null); }
    throw new ApiError(`HTTP ${res.status}`, res.status, body);
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res;
}

export default request;
