'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, RefreshCw } from 'lucide-react'
import { LowStockAlert } from '@/types/dashboard'
import Image from 'next/image'
import Link from 'next/link'

interface LowStockAlertsProps {
  alerts: LowStockAlert[]
}

export function LowStockAlerts({ alerts }: LowStockAlertsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Alertas de Inventario</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          {alerts.length > 0 && (
            <Badge variant="destructive">{alerts.length}</Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.location.reload()}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center space-x-4 p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex-shrink-0">
                {alert.image ? (
                  <Image
                    src={alert.image}
                    alt={alert.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.name}
                </p>
                <p className="text-xs text-gray-600">
                  SKU: {alert.sku}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Stock: {alert.current_stock}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Mínimo: {alert.threshold}
                  </Badge>
                </div>
              </div>
              <Link href={`/admin/products/${alert.id}/edit`}>
                <Button size="sm" variant="outline">
                  Actualizar
                </Button>
              </Link>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay alertas de inventario</p>
              <p className="text-sm">Todos los productos tienen stock suficiente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}