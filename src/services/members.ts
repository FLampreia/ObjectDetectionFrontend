
import API_URL from "@/config/api";
import { getAccessToken } from "./auth";
import { Member } from "@/types/team";


export async function getMembersTeam(teamId: string): Promise<Member[]> {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}/members`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Failed to Update Team");
    }

    return data;
}

export async function exitTeam(teamId: string, userId: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}/remove`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "user_id": userId
            }
        ),
    });


    if (!response.ok) {
        throw new Error("Failed to Remove user from Team");
    }
}