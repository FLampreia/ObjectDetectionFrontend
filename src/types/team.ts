

export type Team = {
    id: string
    name: string
    created_at: string
    role: string
    is_favorite: boolean;
}

export type Member = {
    user_id: string
    username: string
    email: string
    role: string
}