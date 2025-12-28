import React from 'react'
import { getInitials } from '../utils/helper';

const AvatarGroup = ({ users, maxVisible = 3 }) => {

  return (
    <div className='flex items-center'>
      {users.slice(0, maxVisible).map((user, index) => (
        <React.Fragment key={index}>
          {user.profileImageUrl ? (
            <>
              <img
                src={user.profileImageUrl.replace('localhost:8000', 'localhost:5000')}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-medium"
                style={{ display: 'none' }}
              >
                {getInitials(user.name)}
              </div>
            </>
          ) : (
            <div
              className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-medium"
            >
              {getInitials(user.name)}
            </div>
          )}
        </React.Fragment>
      ))}
      {users.length > maxVisible && (
        <span className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3 ">
          +{users.length - maxVisible}
        </span>
      )}
    </div>
  )
}

export default AvatarGroup