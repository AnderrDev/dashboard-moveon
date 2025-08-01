'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryWithProducts } from '@/types/dashboard'
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const columns: ColumnDef<CategoryWithProducts>[] = [
  {
    accessorKey: 'image_url',
    header: 'Imagen',
    cell: ({ row }) => {
      const category = row.original
      const image = category.image_url
      
      return (
        <div className="w-12 h-12 relative">
          {image ? (
            <Image
              src={image}
              alt={category.name}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">IMG</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Categoría
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{category.name}</span>
          <span className="text-sm text-gray-500">/{category.slug}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return description ? (
        <span className="text-sm text-gray-600 max-w-xs truncate block">
          {description}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">Sin descripción</span>
      )
    },
  },
  {
    accessorKey: 'products_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Productos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const count = row.getValue('products_count') as number
      
      return (
        <div className="flex items-center">
          <span className="font-medium">{count}</span>
          <span className="text-sm text-gray-500 ml-1">
            producto{count !== 1 ? 's' : ''}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'sort_order',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Orden
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const order = row.getValue('sort_order') as number
      return <span className="font-mono text-sm">{order}</span>
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Creada',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at') as string)
      return (
        <span className="text-sm text-gray-600">
          {date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const category = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {category.is_active ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]