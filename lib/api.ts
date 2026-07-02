// Same-origin path; proxied to the backend by next.config rewrites so cookies
// remain first-party on the frontend domain.
const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rm_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData?: boolean
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body
      ? JSON.stringify(body)
      : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("rm_token");
    localStorage.removeItem("rm_user");
    window.location.href = "/login";
    throw new Error("Session expired.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

type User = { id: string; email: string; name: string };
type AuthResponse = { token: string; user: User };
type MeResponse = User & { usesLeft: number };

export const api = {
  auth: {
    register: (name: string, email: string, password: string) =>
      request<AuthResponse>("POST", "/auth/register", { name, email, password }),
    login: (email: string, password: string) =>
      request<AuthResponse>("POST", "/auth/login", { email, password }),
    me: () => request<MeResponse>("GET", "/auth/me"),
    updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
      request<AuthResponse>("PATCH", "/auth/profile", data),
  },
  resumes: {
    list: () =>
      request<{ resumeId: string; fileName: string; uploadedAt: string | null; indexStatus: "processing" | "ready" | "error"; skills: string[] }[]>(
        "GET", "/resumes/list"
      ),
    upload: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return request<{ resumeId: string; fileName: string }>(
        "POST", "/resumes/upload", form, true
      );
    },
    delete: (id: string) => request<{ success: boolean }>("DELETE", `/resumes/${id}`),
  },
  analysis: {
    run: (resumeId: string, jobDescription: string) =>
      request<{
        atsScore: number;
        matchingSkills: string[];
        missingSkills: string[];
        recommendations: string[];
        summary: string;
      }>("POST", "/analysis", { resumeId, jobDescription }),
    history: () =>
      request<{
        id: string;
        resumeId: string;
        resumeName: string;
        jobDescription: string;
        atsScore: number;
        createdAt: string;
      }[]>("GET", "/analysis/history"),
    detail: (id: string) =>
      request<{
        id: string;
        resumeName: string;
        jobDescription: string;
        atsScore: number;
        matchingSkills: string[];
        missingSkills: string[];
        recommendations: string[];
        summary: string;
        createdAt: string;
      }>("GET", `/analysis/${id}`),
  },
};
