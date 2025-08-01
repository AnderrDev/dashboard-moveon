'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Download,
  Filter,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'low-stock' | 'featured'>('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando productos...</span>
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

  // Filtrar productos según el filtro seleccionado
  const filteredProducts = products.filter(product => {
    switch (filter) {
      case 'active':
        return product.is_active
      case 'inactive':
        return !product.is_active
      case 'low-stock':
        return product.stock_quantity <= product.low_stock_threshold
      case 'featured':
        return product.is_featured
      default:
        return true
    }
  })

  // Calcular estadísticas
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active).length
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.low_stock_threshold).length
  const featuredProducts = products.filter(p => p.is_featured).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona tu inventario de suplementos deportivos</p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
              <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
              <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeProducts} activos, {totalProducts - activeProducts} inactivos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('active')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Productos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((activeProducts / totalProducts) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('low-stock')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{lowStockProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              Requieren reposición
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('featured')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Destacados</CardTitle>
            <div className="text-yellow-600">⭐</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{featuredProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              Productos promocionados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {filter !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {filter === 'active' && 'Activos'}
                  {filter === 'inactive' && 'Inactivos'}
                  {filter === 'low-stock' && 'Stock Bajo'}
                  {filter === 'featured' && 'Destacados'}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              Todos los productos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('active')}>
              Solo activos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('inactive')}>
              Solo inactivos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('low-stock')}>
              Stock bajo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('featured')}>
              Destacados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {filter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Productos 
            <Badge variant="secondary" className="ml-2">
              {filteredProducts.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredProducts}
            searchKey="name"
            searchPlaceholder="Buscar productos..."
          />
        </CardContent>
      </Card>
    </div>
  )
}