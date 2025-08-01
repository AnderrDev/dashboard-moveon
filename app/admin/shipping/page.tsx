'use client'

import { useState } from 'react'
import { useShipping } from '@/hooks/use-shipping'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  MapPin, 
  Plus, 
  Edit,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Clock,
  DollarSign
} from 'lucide-react'

export default function ShippingPage() {
  const { zones, methods, loading, error, toggleZoneStatus, toggleMethodStatus } = useShipping()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando configuración de envíos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Envíos</h1>
          <p className="text-gray-600">Configura zonas de envío y métodos de entrega</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Zona
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Método
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Zonas de Envío</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{zones.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {zones.filter(z => z.is_active).length} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Métodos de Envío</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{methods.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {methods.filter(m => m.is_active).length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {methods.length > 0 
                ? Math.round(methods.reduce((sum, m) => sum + m.estimated_days, 0) / methods.length)
                : 0
              } días
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Entrega estimada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Costo Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                methods.length > 0 
                  ? methods.reduce((sum, m) => sum + m.price, 0) / methods.length
                  : 0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Por envío
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList>
          <TabsTrigger value="zones">Zonas de Envío</TabsTrigger>
          <TabsTrigger value="methods">Métodos de Envío</TabsTrigger>
        </TabsList>

        {/* Shipping Zones */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={zone.is_active ? 'default' : 'secondary'}>
                      {zone.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleZoneStatus(zone.id)}
                    >
                      {zone.is_active ? (
                        <ToggleLeft className="h-4 w-4" />
                      ) : (
                        <ToggleRight className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{zone.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Ubicaciones:</h4>
                    <div className="flex flex-wrap gap-1">
                      {zone.cities?.map((city, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Métodos de Envío:</h4>
                    <div className="space-y-2">
                      {zone.shipping_methods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between text-sm">
                          <span>{method.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{method.estimated_days} días</span>
                            <span className="font-medium">{formatCurrency(method.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shipping Methods */}
        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{method.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={method.is_active ? 'default' : 'secondary'}>
                      {method.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMethodStatus(method.id)}
                    >
                      {method.is_active ? (
                        <ToggleLeft className="h-4 w-4" />
                      ) : (
                        <ToggleRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{method.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">Precio</h4>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(method.price)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">Tiempo</h4>
                      <p className="text-lg font-bold text-blue-600">
                        {method.estimated_days} días
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">
                      Orden: {method.sort_order}
                    </span>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}