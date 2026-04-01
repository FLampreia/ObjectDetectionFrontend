type AppTitleProps = {
    size?: "sm" | "md" | "lg";
};

export default function AppTitle({ size = "md" }: AppTitleProps) {
    const sizes = {
        sm: "text-4xl",
        md: "text-6xl",
        lg: "text-8xl",
    };

    return (
        <h1 className={`${sizes[size]} font-bold text-white`}>
            ObjectDetection
        </h1>
    );
}