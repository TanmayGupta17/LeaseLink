import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, ExternalLink } from 'lucide-react';

const UserCard = ({
  name = "User Name",
  email = "user@example.com",
  avatar = "/api/placeholder/150/150",
  phone,
  location,
  position,
  joinDate,
  socialLinks = [],
  status = "active",
  stats = [],
  actions = [],
  className = "",
  variant = "default"
}) => {
  // Status indicator styles
  const statusStyles = {
    active: { color: "bg-green-500", label: "Active" },
    away: { color: "bg-yellow-500", label: "Away" },
    busy: { color: "bg-red-500", label: "Busy" },
    offline: { color: "bg-gray-400", label: "Offline" }
  };

  // Card style variants
  const cardVariants = {
    default: "bg-white shadow-lg rounded-lg",
    flat: "bg-white border border-gray-200 rounded-lg",
    elevated: "bg-white shadow-xl rounded-xl"
  };

  const currentStatus = statusStyles[status] || statusStyles.active;
  const cardStyle = cardVariants[variant] || cardVariants.default;

  return (
    <div className={`${className}`}>
      <div className={`${cardStyle} overflow-hidden`}>
        {/* Card Header - Optional Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12"></div>
        
        {/* Avatar Section */}
        <div className="px-6 py-4 flex flex-col items-center">
          <div className="relative -mt-10 mb-4">
            <div className="rounded-full bg-white p-1 shadow-md">
              <img 
                src={avatar} 
                alt={`${name}'s Avatar`} 
                className="rounded-full w-24 h-24 object-cover border-2 border-white" 
              />
            </div>
            
            {/* Status indicator */}
            <div className="absolute bottom-1 right-1">
              <div className="flex items-center">
                <span className={`${currentStatus.color} w-3 h-3 rounded-full`}></span>
              </div>
            </div>
          </div>
          
          {/* User Name */}
          <h2 className="text-center text-2xl font-bold text-gray-800">{name}</h2>
          
          {/* Position/Title */}
          {position && (
            <p className="text-center text-gray-600 font-medium mt-1">{position}</p>
          )}
          
          {/* Status */}
          <div className="mt-2 flex items-center text-sm font-medium">
            <span className={`${currentStatus.color} w-2 h-2 rounded-full mr-2`}></span>
            <span className="text-gray-500">{currentStatus.label}</span>
          </div>
        </div>
        
        {/* User Stats - Conditional */}
        {stats.length > 0 && (
          <div className="px-6 py-3 border-t border-b border-gray-100">
            <div className="flex justify-between items-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-center flex-1">
                  <span className="block text-lg font-bold text-gray-800">{stat.value}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact Details */}
        <div className="px-6 py-4">
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{email}</span>
            </div>
            
            {/* Phone - Conditional */}
            {phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">{phone}</span>
              </div>
            )}
            
            {/* Location - Conditional */}
            {location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">{location}</span>
              </div>
            )}
            
            {/* Join Date - Conditional */}
            {joinDate && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">Joined {joinDate}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links - Conditional */}
        {socialLinks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-center space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon || <ExternalLink className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons - Conditional */}
        {actions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    action.primary
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;

// Example usage:
// <UserCard 
//   name="John Doe"
//   email="john.doe@example.com"
//   avatar="/api/placeholder/150/150"
//   phone="+1 (555) 123-4567"
//   location="New York, USA"
//   position="Senior Developer"
//   joinDate="Jan 2023"
//   status="active"
//   variant="elevated"
//   stats={[
//     { label: "Projects", value: "12" },
//     { label: "Tasks", value: "25" },
//     { label: "Completed", value: "18" }
//   ]}
//   actions={[
//     { label: "Message", onClick: () => {}, primary: true },
//     { label: "Profile", onClick: () => {} }
//   ]}
//   socialLinks={[
//     { url: "https://linkedin.com", icon: <LinkedInIcon /> },
//     { url: "https://github.com", icon: <GitHubIcon /> }
//   ]}
// />