'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'

import { type SteamStore, createSteamStore } from '@/store/steam-store'

export type SteamStoreApi = ReturnType<typeof createSteamStore>

export const SteamStoreContext = createContext<SteamStoreApi | undefined>(
  undefined,
)

export interface SteamStoreProviderProps {
  children: ReactNode
}

export const SteamStoreProvider = ({ children }: SteamStoreProviderProps) => {
  const [store] = useState(() => createSteamStore())
  return (
    <SteamStoreContext.Provider value={store}>
      {children}
    </SteamStoreContext.Provider>
  )
}

export const useSteamStore = <T,>(selector: (store: SteamStore) => T): T => {
  const steamStoreContext = useContext(SteamStoreContext)
  if (!steamStoreContext) {
    throw new Error('useSteamStore must be used within SteamStoreProvider')
  }

  return useStore(steamStoreContext, selector)
}
