import { create } from 'zustand';

/** Small flag so the launch screen can wait for fonts as well as saved data. */
export const useAppReady = create<{ fontsReady: boolean }>(() => ({ fontsReady: false }));

export const setFontsReady = () => useAppReady.setState({ fontsReady: true });
