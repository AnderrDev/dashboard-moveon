'use client'

import { AlertTriangle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LowStockAlert } from '@/types/dashboard'

interface LowStockAlertsProps {
  alerts: LowStockAlert[]
}

export function LowStockAlerts({ alerts }: LowStockAlertsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
        {alerts.length > 0 && (
          <Badge variant="destructive">{alerts.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No hay alertas de stock bajo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-3">
                <div className="relative">
                  {alert.image ? (
                    <img
                      src={alert.image}
                      alt={alert.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <AlertTriangle className="absolute -top-1 -right-1 h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.name}</p>
                  <p className="text-xs text-gray-500">SKU: {alert.sku}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-red-600 font-medium">
                      Stock: {alert.current_stock}
                    </span>
                    <span className="text-xs text-gray-500">
                      Umbral: {alert.threshold}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}