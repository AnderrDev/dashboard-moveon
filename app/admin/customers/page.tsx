'use client'

import { useState } from 'react'
import { useCustomers } from '@/hooks/use-customers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign,
  Filter,
  Download,
  Loader2,
  Mail
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CustomersPage() {
  const { customers, loading, error } = useCustomers()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'verified' | 'unverified'>('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando clientes...</span>
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

  // Filtrar clientes según el filtro seleccionado
  const filteredCustomers = customers.filter(customer => {
    switch (filter) {
      case 'active':
        return customer.is_active
      case 'inactive':
        return !customer.is_active
      case 'verified':
        return customer.email_verified
      case 'unverified':
        return !customer.email_verified
      default:
        return true
    }
  })

  // Calcular estadísticas
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.is_active).length
  const verifiedCustomers = customers.filter(c => c.email_verified).length
  const totalSpent = customers.reduce((sum, customer) => sum + customer.total_spent, 0)

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestiona la base de datos de clientes</p>
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
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Enviar Newsletter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeCustomers} activos, {totalCustomers - activeCustomers} inactivos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('active')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((activeCustomers / totalCustomers) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('verified')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Email Verificado</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{verifiedCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((verifiedCustomers / totalCustomers) * 100).toFixed(1)}% verificados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gastado por todos los clientes
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
                  {filter === 'verified' && 'Verificados'}
                  {filter === 'unverified' && 'No Verificados'}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              Todos los clientes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('active')}>
              Solo activos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('inactive')}>
              Solo inactivos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('verified')}>
              Email verificado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('unverified')}>
              Email no verificado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {filter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Clientes 
            <Badge variant="secondary" className="ml-2">
              {filteredCustomers.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredCustomers}
            searchKey="email"
            searchPlaceholder="Buscar por email..."
          />
        </CardContent>
      </Card>
    </div>
  )
}