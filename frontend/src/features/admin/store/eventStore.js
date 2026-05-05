import { create } from 'zustand'
import { eventService } from '../services/eventService'

export const useEventStore = create((set) => ({
  events: [],
  total: 0,
  loading: false,
  error: null,

  fetchEvents: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const res = await eventService.list(params)
      const payload = res.data
      set({
        events: payload.results ?? payload,
        total: payload.count ?? (payload.results ?? payload).length,
        loading: false,
      })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load events' })
    }
  },

  createEvent: async (data) => {
    const res = await eventService.create(data)
    return res.data.data
  },

  updateEvent: async (id, data) => {
    const res = await eventService.update(id, data)
    return res.data.data
  },

  deleteEvent: async (id) => {
    await eventService.delete(id)
  },
}))
