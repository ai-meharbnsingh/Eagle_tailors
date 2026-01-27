import React from 'react';

const statusConfig = {
  new: { color: 'bg-blue-500', label: 'New', icon: '🆕' },
  pending: { color: 'bg-yellow-500', label: 'Pending', icon: '⏳' },
  ready: { color: 'bg-green-500', label: 'Ready', icon: '✅' },
  delivered: { color: 'bg-gray-400', label: 'Delivered', icon: '📦' },
  overdue: { color: 'bg-red-500', label: 'Overdue', icon: '⚠️' },
};

const RecentActivity = ({ activities, onViewAll, onItemClick }) => {
  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800">Recent Activity</h3>
          <p className="text-sm text-gray-500">हाल की गतिविधि</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View All
          <span>→</span>
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-50">
        {activities.map((activity) => {
          const status = statusConfig[activity.status];
          return (
            <div
              key={activity.id}
              onClick={() => onItemClick(activity.id)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Status indicator */}
              <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center text-white text-lg`}>
                {status.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">#{activity.folio}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700 truncate">{activity.customerName}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{activity.items}</p>
              </div>

              {/* Amount & Time */}
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{activity.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>

              {/* Arrow */}
              <span className="text-gray-300">›</span>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {activities.length === 0 && (
        <div className="py-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-2 text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
