
export default function FooterNavigation() {
    return (
        <>
            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-cream flex justify-around py-2 shadow-md border-2 border-forest_green">
                <button onClick={() => alert("Chatbot!")}>
                <img src="/icons/chat.svg" alt="Chat" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Profile!")}>
                <img src="/icons/user.svg" alt="Profile" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Home!")}>
                <img src="/icons/home.svg" alt="Home" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Ingredient analyzer!")}>
                <img src="/icons/carrot.svg" alt="Carrot" className="w-8 h-8" />
                </button>
            </nav>
        </>
    )
}