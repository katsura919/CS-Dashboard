export function saveToken(token: string) {
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
  }
  
  export function getToken(): string | null {
    return document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || null;
  }
  
  export function removeToken() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
  