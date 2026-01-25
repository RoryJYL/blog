'use client'

import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import type { ProfileSummary } from '@/lib/playstation-types'
import { useEffect, useState } from 'react'
import { PlayStationTrophies } from './playstation-trophies'

export function PlayStationSection() {
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const apiUrl = process.env.PSN_API_URL
        if (!apiUrl) {
          throw new Error('PSN_API_URL not configured')
        }

        const response = await fetch(`${apiUrl}/api/profile-summary`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              Loading PlayStation profile...
            </ItemTitle>
          </ItemContent>
        </Item>
      </div>
    )
  }

  if (error || !profile) {
    return null
  }

  return <PlayStationTrophies profile={profile} />
}
