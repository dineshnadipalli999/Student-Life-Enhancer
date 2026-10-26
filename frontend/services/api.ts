const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5010";
export async function apiFetch<T>(endpoint:string, options?:RequestInit):Promise<T>{
  const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;
  const stored = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
  const userId = stored ? (JSON.parse(stored) as { id?: string }).id : undefined;
  const res=await fetch(`${API_URL}${endpoint}`,{...options,headers:{...(isFormData ? {} : {"Content-Type":"application/json"}),...(userId ? {"x-user-id": userId} : {}),...options?.headers}});
  if(!res.ok){
    const body=await res.json().catch(()=>null) as {message?:string|string[]}|null;
    const message=Array.isArray(body?.message)?body.message.join(", "):body?.message;
    throw new Error(message || "API request failed");
  }
  return res.json();
}
