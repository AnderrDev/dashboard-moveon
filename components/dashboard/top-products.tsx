import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopProduct } from '@/types/dashboard'
import Image from 'next/image'

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.units_sold} unidades vendidas
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="secondary" className="mb-1">
                  #{index + 1}
                </Badge>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay datos de productos disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}