import API_URL from "@/config/api";
import { getAccessToken } from "./auth";


// TODO se valer a pena fazer um apiFetch para todas as chamadas api estarem centralizadas

export async function updateUsername(userId: string, username: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update username");
    }

    return data;
}

export async function updateFullName(userId: string, full_name: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update full name");
    }

    return data;
}

export async function updatePassword(userId:string, password: string, currentPassword: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            password,
            current_password: currentPassword
         }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
    }

    return data;
}

export async function deletePassword(userId:string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
    }

    return data;
}