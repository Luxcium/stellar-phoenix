interface PageHeaderProps {
    title: string;
    description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            {description && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    {description}
                </p>
            )}
        </div>
    );
}
