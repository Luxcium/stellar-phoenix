import Counter from '@/modules/demo/Counter'

export default function DemoPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">
                    Animation Demo
                </h1>
                <div className="max-w-2xl mx-auto space-y-12">
                    <section className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                            Interactive Counter
                        </h2>
                        <p className="mb-6 text-gray-600 leading-relaxed">
                            This counter demonstrates various animations:
                        </p>
                        <ul className="list-disc list-inside mb-8 text-gray-600 space-y-2">
                            <li className="transform hover:translate-x-2 transition-transform duration-200">
                                Scale animation on count change
                            </li>
                            <li className="transform hover:translate-x-2 transition-transform duration-200">
                                Button hover effects with background transition
                            </li>
                            <li className="transform hover:translate-x-2 transition-transform duration-200">
                                Active state animations
                            </li>
                            <li className="transform hover:translate-x-2 transition-transform duration-200">
                                Shadow transitions on hover
                            </li>
                        </ul>
                        <div className="transform transition-all duration-300 hover:shadow-xl rounded-xl p-4">
                            <Counter initialValue={0} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
