type AppTitleProps = {
    size?:"xxs" | "xs" | "sm" | "md" | "lg";
};

export default function AppTitle({ size = "md" }: AppTitleProps) {
    const sizes = {
        xxs: "text-1xl sm:text-2xl md:text-2xl",
        xs: "text-2xl sm:text-3xl md:text-4xl",
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