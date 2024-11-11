import React from "react";
import LogoImg from '../assets/logo.png';
// import { FireFilled } from "@ant-design/icons";

const Logo = ({ collapsed }) => {
  return (
    <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-icon">
      <img style={{ width: '100%', height: '100%' }}  src={LogoImg} alt="fieldMap" />
      </div>
      {!collapsed && <span className="logo-text">PSIC</span>}
    </div>
  );
};

export default Logo;
