import { TeamMembersSection } from "./team-members-section";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TeamPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full flex-col justify-between">
            <h1 className="text-3xl font-bold mb-8 pt-8">Teams</h1>

            <section >
                <TeamMembersSection teamId={id}/>
            </section>
        </main>
    );
}