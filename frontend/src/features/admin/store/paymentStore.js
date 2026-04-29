import { create } from 'zustand'
import { paymentService } from '../services/paymentService'

export const usePaymentStore = create((set) => ({
  payments: [],
  total: 0,
  loading: false,
  error: null,

  fetchPayments: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const res = await paymentService.list(params)
      const payload = res.data.data
      set({
        payments: payload.results ?? payload,
        total: payload.count ?? (payload.results ?? payload).length,
        loading: false,
      })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load payments' })
    }
  },

  updatePayment: async (id, data) => {
    const res = await paymentService.update(id, data)
    return res.data.data
  },
}))
