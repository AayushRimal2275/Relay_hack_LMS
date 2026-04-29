import { cn } from '@/lib/utils'

const variants = {
  green: 'bg-green-500/20 text-green-400 border border-green-500/30',
  red: 'bg-red-500/20 text-red-400 border border-red-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  slate: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
}

export function Badge({ children, variant = 'slate', className }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  )
}

// Helpers for common status maps
export const statusVariant = {
  // Payment statuses
  completed: 'green',
  pending: 'yellow',
  failed: 'red',
  refunded: 'purple',
  // Event statuses
  upcoming: 'blue',
  ongoing: 'green',
  cancelled: 'red',
  // Course
  true: 'green',
  false: 'slate',
  // Job
  open: 'green',
  closed: 'red',
  paused: 'yellow',
  // Registration
  registered: 'blue',
  attended: 'green',
  waitlisted: 'orange',
}
