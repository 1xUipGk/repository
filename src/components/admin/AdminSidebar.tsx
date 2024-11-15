'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChartLine,
  faImages,
  faComments,
  faUsers,
  faCog
} from '@fortawesome/free-solid-svg-icons';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuSections = [
    {
      title: 'عام',
      items: [
        { path: '/admin/dashboard', icon: faHome, label: 'الرئيسية' },
        { path: '/admin/statistics', icon: faChartLine, label: 'الإحصائيات' },
      ]
    },
    {
      title: 'المحتوى',
      items: [
        { path: '/admin/works', icon: faImages, label: 'الأعمال' },
        { path: '/admin/testimonials', icon: faComments, label: 'التقييمات' },
      ]
    },
    {
      title: 'الإدارة',
      items: [
        { path: '/admin/users', icon: faUsers, label: 'المستخدمين' },
        { path: '/admin/settings', icon: faCog, label: 'الإعدادات' },
      ]
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {menuSections.map((section, index) => (
          <div key={index} className="nav-section">
            <h3 className="section-title">{section.title}</h3>
            {section.items.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
} 