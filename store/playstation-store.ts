import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export type PlaystationState = {
  showPossibleSpoilerTrophies: boolean
}

export type PlaystationActions = {
  setShowPossibleSpoilerTrophies: (showPossibleSpoilerTrophies: boolean) => void
}

export type PlaystationStore = PlaystationState & PlaystationActions

export const defaultInitState: PlaystationState = {
  showPossibleSpoilerTrophies: false,
}

export const createPlaystationStore = (
  initState: PlaystationState = defaultInitState,
) => {
  return createStore<PlaystationStore>()(
    persist(
      (set) => ({
        ...initState,
        setShowPossibleSpoilerTrophies: (
          showPossibleSpoilerTrophies: boolean,
        ) => set({ showPossibleSpoilerTrophies }),
      }),
      {
        name: 'playstation-store',
      },
    ),
  )
}
