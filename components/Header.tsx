
export default function Header() {
    return (
      <>
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div
            onClick={() => alert("Home!")}
            className="cursor-pointer"
          >
            <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
          </div>

          {/* user badge */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
              onClick={() => alert("User profile!")}
            >
              TW
            </div>
            <button className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
              onClick={() => alert("Logout!")}
            >
              Logout
            </button>
          </div>
        </header>
     </>
    );
  }
  