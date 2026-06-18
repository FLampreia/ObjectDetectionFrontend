import API_URL from "@/config/api";
import { getAccessToken } from "./auth";
import { Team } from "@/types/team";

export async function addTeam(teamname: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "name": teamname
            }
        ),
    });

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
        throw new Error(data.error || "Failed to create team");
    }

    return data;
}


export async function getLoggedTeams(): Promise<Team[]> {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/logged`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get Teams");
    }

    return data;
}

export async function toggleFavorite(teamId: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}/fav`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to Toggle Favorite");
    }

}

export async function deleteTeam(teamId: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to Delete Team");
    }

}

export async function updateTeam(teamId: string, teamName: string) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "name": teamName
            }
        ),
    });

    if (!response.ok) {
        throw new Error("Failed to Update Team");
    }
}

