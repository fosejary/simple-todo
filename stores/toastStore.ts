import { create } from 'zustand';

export interface ToastPayload {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastState {
  toast: (ToastPayload & { id: number }) | null;
  show: (payload: ToastPayload) => void;
  hide: () => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (payload) => set({ toast: { ...payload, id: nextId++ } }),
  hide: () => set({ toast: null }),
}));

export const showToast = (payload: ToastPayload) => useToastStore.getState().show(payload);
