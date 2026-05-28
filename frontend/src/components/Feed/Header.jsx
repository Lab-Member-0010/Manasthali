import React from "react";
import ManasthaliLogo from "@assets/Manasthali.png";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-5 py-[10px] bg-white fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <img src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
        <div className="text-4xl font-bold bg-gradient-to-r from-[#1a5a6d] via-[#39a4bf] via-[#25768a] via-[#8d7fd2] via-[#7c5fb5] via-[#a06bba] via-[#e584b5] to-[#e0718e] bg-clip-text text-transparent inline brightness-110 relative">Manasthali</div>
      </div>
    </div>
  );
};

export default Header;
