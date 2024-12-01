import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full bg-black h-16 border-b border-b-gray-800 flex items-center">
      <img 
        src="./assets/HeaderLogo.png" 
        alt="Logo" 
        className="h-12 ml-28" 
      />
    </div>
  );
};

export default Navbar;