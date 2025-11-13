export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent py-4 px-8 z-50">
      <div className="flex items-center justify-start">
        <img
          src="https://res.cloudinary.com/dppdnwp38/image/upload/v1762977396/logoo_icwdbg.png"
          alt="SkinLumina Logo"
          className="h-20 w-56 object-contain"
        />
      </div>
    </nav>
  );
}