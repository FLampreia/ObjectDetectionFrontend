export type TokenPayload = {
    user: {
        email: string;
        user_id: string;
        role: string;
    };
    exp: number;
    jti: string;
    refresh: boolean;
};