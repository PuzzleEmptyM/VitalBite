import { useRouter } from "next/navigation";

export default function FooterNavigation() {
    const router = useRouter(); // Initialize the router

    return (
        <>
            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-cream flex justify-around py-2 pb-6 shadow-md border-2 border-forest_green">
                {/* Chatbot Button */}
                <button onClick={() => router.push("/aichatbot")}>
                    <img src="/icons/chat.svg" alt="Chat" className="w-8 h-8" />
                </button>
                
                {/* Profile Button */}
                <button onClick={() => router.push("/userprofile")}>
                    <img src="/icons/user.svg" alt="Profile" className="w-8 h-8" />
                </button>
                
                {/* Home Button */}
                <button onClick={() => router.push("/")}>
                    <img src="/icons/home.svg" alt="Home" className="w-8 h-8" />
                </button>
                
                {/* Ingredient Analyzer Button */}
                <button onClick={() => router.push("/ingredientanalyzer")}>
                    <img src="/icons/carrot.svg" alt="Ingredient Analyzer" className="w-8 h-8" />
                </button>
            </nav>
        </>
    );
}
