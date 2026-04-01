type AppTitleProps = {
    size?: "sm" | "md" | "lg";
};

export default function AppTitle({ size = "md" }: AppTitleProps) {
    const sizes = {
        sm: "text-3xl sm:text-4xl md:text-5xl",
        md: "text-4xl sm:text-5xl md:text-6xl",
        lg: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
    };

    return (
        <h1 className={`${sizes[size]} font-bold text-white text-center`}>
            ObjectDetection
        </h1>
    );
}