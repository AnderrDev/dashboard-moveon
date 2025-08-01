'use client'

import { useState } from 'react'
import { useReviews } from '@/hooks/use-reviews'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Star,
  Filter,
  Download,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ReviewsPage() {
  const { reviews, loading, error } = useReviews()
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'verified'>('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando reseñas...</span>
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

  // Filtrar reseñas según el filtro seleccionado
  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case 'approved':
        return review.is_approved
      case 'pending':
        return !review.is_approved
      case 'verified':
        return review.verified_purchase
      default:
        return true
    }
  })

  // Calcular estadísticas
  const totalReviews = reviews.length
  const approvedReviews = reviews.filter(r => r.is_approved).length
  const pendingReviews = reviews.filter(r => !r.is_approved).length
  const verifiedReviews = reviews.filter(r => r.verified_purchase).length
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reseñas</h1>
          <p className="text-gray-600">Gestiona las reseñas y comentarios de productos</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reseñas</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              {approvedReviews} aprobadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('approved')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{approvedReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalReviews > 0 ? ((approvedReviews / totalReviews) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('pending')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              Requieren moderación
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('verified')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verificadas</CardTitle>
            <Badge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{verifiedReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              Compra verificada
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Calificación</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Promedio general
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
                  {filter === 'approved' && 'Aprobadas'}
                  {filter === 'pending' && 'Pendientes'}
                  {filter === 'verified' && 'Verificadas'}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              Todas las reseñas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('approved')}>
              Solo aprobadas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('pending')}>
              Solo pendientes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('verified')}>
              Compra verificada
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {filter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Reseñas 
            <Badge variant="secondary" className="ml-2">
              {filteredReviews.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredReviews}
            searchKey="product_name"
            searchPlaceholder="Buscar por producto..."
          />
        </CardContent>
      </Card>
    </div>
  )
}