export type TokenPayload = {
    sub: string;
    session_id: string;
    exp: number;
    jti: string;
    type: "access" | "refresh";
};
