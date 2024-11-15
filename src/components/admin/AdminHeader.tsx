'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export default function AdminHeader({ onMenuClick, onLogout }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h2>لوحة التحكم</h2>
      </div>

      <div className="header-right">
        <div className="admin-profile">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <span className="admin-name">علي إسماعيل</span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
} 