export function StatCard({ label, value, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && <p className="text-xs text-slate-500">{trend}</p>}
    </div>
  )
}
