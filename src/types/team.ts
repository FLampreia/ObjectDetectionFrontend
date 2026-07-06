
export type Member = {
    user_id: string
    username: string
    email: string
    role: string
}

export type Team = {
    id: string
    name: string
    created_at: string
    is_favorite: boolean;
    owner: Member
    current_user_role: string
}
