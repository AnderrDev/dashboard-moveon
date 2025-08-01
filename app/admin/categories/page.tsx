'use client'

import { useState } from 'react'
import { useCategories } from '@/hooks/use-categories'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Tag, 
  TrendingUp, 
  Download,
  Filter,
  Loader2,
  Eye
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

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
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

  // Filtrar categorías según el filtro seleccionado
  const filteredCategories = categories.filter(category => {
    switch (filter) {
      case 'active':
        return category.is_active
      case 'inactive':
        return !category.is_active
      default:
        return true
    }
  })

  // Calcular estadísticas
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.is_active).length
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products_count, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorías</h1>
          <p className="text-gray-600">Organiza tus productos por categorías</p>
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
          <Link href="/admin/categories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Categorías</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCategories}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeCategories} activas, {totalCategories - activeCategories} inactivas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('active')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categorías Activas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeCategories}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalCategories > 0 ? ((activeCategories / totalCategories) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Productos</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              En todas las categorías
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
                  {filter === 'active' && 'Activas'}
                  {filter === 'inactive' && 'Inactivas'}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              Todas las categorías
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('active')}>
              Solo activas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('inactive')}>
              Solo inactivas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {filter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Categorías 
            <Badge variant="secondary" className="ml-2">
              {filteredCategories.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredCategories}
            searchKey="name"
            searchPlaceholder="Buscar categorías..."
          />
        </CardContent>
      </Card>
    </div>
  )
}