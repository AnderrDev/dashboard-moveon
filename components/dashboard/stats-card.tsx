import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  className?: string
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="text-gray-400">{icon}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center text-sm font-medium',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600',
              change === 0 && 'text-gray-500'
            )}>
              {isPositive && <TrendingUp className="h-4 w-4 mr-1" />}
              {isNegative && <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}