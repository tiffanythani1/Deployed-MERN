import { Link } from "react-router-dom";
import logo from "../assets/Skinlumina_Logo.png";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="SkinLumina Logo" className="h-10 w-10 rounded-full" />
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          SkinLumina
        </Link>
      </div>
      <div className="flex space-x-4 text-gray-600 font-medium">
        <Link to="/" className="hover:text-indigo-600">Gallery</Link>
        <Link to="/upload" className="hover:text-indigo-600">Upload</Link>
      </div>
    </nav>
  );
}
