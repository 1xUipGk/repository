import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">
        <FontAwesomeIcon 
          icon={
            type === 'success' ? faCheckCircle : 
            type === 'error' ? faExclamationCircle : 
            faInfoCircle
          } 
        />
      </div>
      <p>{message}</p>
      <button className="close-notification" onClick={onClose}>×</button>
    </div>
  );
} 