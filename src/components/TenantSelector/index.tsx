'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import './styles.css'

type Tenant = {
  id: number
  name: string
}

export const TenantSelector: React.FC = () => {
  const { user, refreshCookieAsync } = useAuth()
  const { config } = useConfig()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get user's tenants and selected tenant from JWT
  const userTenants = (user as any)?.tenants ?? []
  const selectedTenant = (user as any)?.selectedTenant

  // Get the selected tenant ID (handle both populated and unpopulated)
  const selectedTenantId =
    typeof selectedTenant === 'number' ? selectedTenant : selectedTenant?.id

  // Fetch tenant details on mount
  useEffect(() => {
    const fetchTenants = async () => {
      if (!userTenants.length) return

      try {
        const ids = userTenants
          .map((t: number | Tenant) => (typeof t === 'number' ? t : t.id))
          .filter(Boolean)

        if (ids.length === 0) return

        const response = await fetch(
          `${config.routes.api}/tenants?where[id][in]=${ids.join(',')}`,
        )
        const data = (await response.json()) as { docs?: Tenant[] }

        if (data.docs) {
          setTenants(data.docs)
        }
      } catch (error) {
        console.error('Failed to fetch tenants:', error)
      }
    }

    fetchTenants()
  }, [userTenants, config.routes.api])

  const handleTenantChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTenantId = parseInt(e.target.value, 10)
      if (isNaN(newTenantId) || newTenantId === selectedTenantId) return

      setIsLoading(true)

      try {
        // Update the user's selectedTenant
        const response = await fetch(`${config.routes.api}/users/${user?.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedTenant: newTenantId,
          }),
        })

        if (response.ok) {
          // Refresh the auth cookie to get updated JWT with new selectedTenant
          await refreshCookieAsync()
          // Reload the page to refresh all data with new tenant filter
          window.location.reload()
        } else {
          console.error('Failed to update tenant')
        }
      } catch (error) {
        console.error('Error updating tenant:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedTenantId, config.routes.api, user?.id, refreshCookieAsync],
  )

  // Don't render if user has no tenants or only one tenant
  if (!user || tenants.length <= 1) {
    return null
  }

  return (
    <div className="tenant-selector">
      <label className="tenant-selector__label">Tenant:</label>
      <select
        className="tenant-selector__select"
        value={selectedTenantId ?? ''}
        onChange={handleTenantChange}
        disabled={isLoading}
      >
        {tenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
      {isLoading && <span className="tenant-selector__loading">...</span>}
    </div>
  )
}

export default TenantSelector
