import { useEffect, useState } from 'react'

interface CounterProps {
    initialValue: number
}

const Counter = ({ initialValue }: CounterProps) => {
    const [count, setCount] = useState(initialValue)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleIncrement = async () => {
        setIsLoading(true)
        setIsAnimating(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        setCount(count + 1)
        setIsLoading(false)
    }

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => setIsAnimating(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isAnimating])

    return (
        <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 transform hover:scale-105 transition-transform duration-300">
                Counter Demo
            </h2>
            <div className="flex flex-col items-center gap-6">
                <div className="text-4xl font-bold transition-all duration-300 transform">
                    <span
                        className={`
                            inline-block 
                            ${isAnimating ? 'scale-125 text-green-500' : 'scale-100'} 
                            ${isLoading ? 'opacity-50' : 'opacity-100'}
                            transition-all duration-300
                        `}
                    >
                        {count}
                    </span>
                </div>
                <button
                    onClick={handleIncrement}
                    disabled={isLoading}
                    className={`
                        px-6 py-3 
                        bg-blue-500 text-white rounded-lg
                        hover:bg-blue-600 
                        active:scale-95
                        transform transition-all duration-300
                        hover:shadow-lg
                        relative
                        overflow-hidden
                        group
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        disabled:hover:bg-blue-500
                        disabled:active:scale-100
                    `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            'Increment'
                        )}
                    </span>
                    <div className={`
                        absolute inset-0 
                        bg-blue-400 
                        transform scale-x-0 
                        group-hover:scale-x-100 
                        transition-transform 
                        origin-left 
                        duration-300
                        ${isLoading ? 'hidden' : ''}
                    `} />
                </button>
            </div>
        </div>
    )
}

export default Counter
