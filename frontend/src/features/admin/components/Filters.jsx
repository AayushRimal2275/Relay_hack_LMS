import { Search } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 w-64"
      />
    </div>
  )
}

export function Select({ value, onChange, options, placeholder = 'All' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input w-auto"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
