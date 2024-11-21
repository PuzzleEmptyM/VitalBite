export default function Header() {
    return (
      <header className="flex items-center justify-between w-full p-4">
        {/* Logo */}
        <img src="/images/vb_logo.png" alt="VB Logo" className="w-20 h-20" />
  
        {/* User Badge */}
        <div className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-sm">
          TW
        </div>
      </header>
    );
  }
  