import { create } from 'zustand'
import { courseService } from '../services/courseService'

export const useCourseStore = create((set, get) => ({
  courses: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,

  fetchCourses: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const res = await courseService.list(params)
      const payload = res.data
      set({
        courses: payload.results ?? payload,
        total: payload.count ?? (payload.results ?? payload).length,
        loading: false,
      })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load courses' })
    }
  },

  createCourse: async (data) => {
    const res = await courseService.create(data)
    return res.data.data
  },

  updateCourse: async (id, data) => {
    const res = await courseService.update(id, data)
    return res.data.data
  },

  deleteCourse: async (id) => {
    await courseService.delete(id)
  },
}))
