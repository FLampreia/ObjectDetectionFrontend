const config = {
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    PROCESSOR_HOST: process.env.NEXT_PUBLIC_PROCESSOR_HOST || "localhost",
    PROCESSOR_PORT: process.env.NEXT_PUBLIC_PROCESSOR_PORT || "8001",
};

export default config;