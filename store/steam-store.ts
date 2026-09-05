import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type SteamState = {
  showPossibleSpoilerAchievements: boolean
}

export type SteamActions = {
  setShowPossibleSpoilerAchievements: (
    showPossibleSpoilerAchievements: boolean,
  ) => void
}

export type SteamStore = SteamState & SteamActions

export const defaultInitState: SteamState = {
  showPossibleSpoilerAchievements: false,
}

export const createSteamStore = (initState: SteamState = defaultInitState) => {
  return createStore<SteamStore>()(
    persist(
      (set) => ({
        ...initState,
        setShowPossibleSpoilerAchievements: (
          showPossibleSpoilerAchievements: boolean,
        ) => set({ showPossibleSpoilerAchievements }),
      }),
      {
        name: 'steam-store',
      },
    ),
  )
}
