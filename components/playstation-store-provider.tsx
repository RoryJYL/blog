'use client'

import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type PlaystationStore,
  createPlaystationStore,
} from '@/store/playstation-store'

export type PlaystationStoreApi = ReturnType<typeof createPlaystationStore>

export const PlaystationStoreContext = createContext<
  PlaystationStoreApi | undefined
>(undefined)

export interface PlaystationStoreProviderProps {
  children: ReactNode
}

export const PlaystationStoreProvider = ({
  children,
}: PlaystationStoreProviderProps) => {
  const [store] = useState(() => createPlaystationStore())
  return (
    <PlaystationStoreContext.Provider value={store}>
      {children}
    </PlaystationStoreContext.Provider>
  )
}

export const usePlaystationStore = <T,>(
  selector: (store: PlaystationStore) => T,
): T => {
  const playstationStoreContext = useContext(PlaystationStoreContext)
  if (!playstationStoreContext) {
    throw new Error(
      'usePlaystationStore must be used within PlaystationStoreProvider',
    )
  }

  return useStore(playstationStoreContext, selector)
}
