import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, Package, ShoppingCart, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Dashboard Administrativo
            <span className="block text-blue-600">Suplementos Deportivos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de gestión para tu ecommerce. Administra productos, pedidos, 
            clientes y análisis desde una sola plataforma.
          </p>
          <Link href="/admin">
            <Button size="lg" className="text-lg px-8 py-6">
              Acceder al Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Gestión de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Administra tu inventario de suplementos con control completo de stock y categorías.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Control de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Procesa y rastrea pedidos con estados en tiempo real y gestión de envíos.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Base de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Administra usuarios, historiales de compra y segmentación de clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Analytics y Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Insights detallados de ventas, productos más vendidos y métricas clave.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Preview */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-900 p-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vista Previa del Dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Interfaz moderna y intuitiva para gestionar tu negocio
              </p>
              <Link href="/admin">
                <Button variant="outline">
                  Ver Dashboard Completo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p>Construido con Next.js 15, TypeScript, Tailwind CSS y Supabase</p>
        </div>
      </div>
    </div>
  )
}