'use client'

import { useState } from 'react'
import { useSettings } from '@/hooks/use-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Truck, 
  Mail,
  Search,
  Save,
  Loader2
} from 'lucide-react'

export default function SettingsPage() {
  const { settings, loading, error, updateSetting } = useSettings()
  const [saving, setSaving] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando configuración...</span>
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

  const handleSave = async () => {
    setSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
  }

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value || ''
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra la configuración general del sistema</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Envíos</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nombre del Sitio</Label>
                  <Input
                    id="site_name"
                    defaultValue={getSetting('site_name')}
                    placeholder="Nombre de tu tienda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input
                    id="currency"
                    defaultValue={getSetting('currency')}
                    placeholder="COP"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_description">Descripción del Sitio</Label>
                <Textarea
                  id="site_description"
                  defaultValue={getSetting('site_description')}
                  placeholder="Descripción de tu tienda"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración de Impuestos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">Tasa de Impuesto (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      defaultValue={getSetting('tax_rate')}
                      placeholder="19"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stripe</Label>
                  <p className="text-sm text-gray-500">Acepta pagos con tarjeta de crédito</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>PayPal</Label>
                  <p className="text-sm text-gray-500">Acepta pagos con PayPal</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Transferencia Bancaria</Label>
                  <p className="text-sm text-gray-500">Acepta transferencias bancarias</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración de Stripe</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe_public_key">Clave Pública</Label>
                    <Input
                      id="stripe_public_key"
                      type="password"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe_secret_key">Clave Secreta</Label>
                    <Input
                      id="stripe_secret_key"
                      type="password"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Envíos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="free_shipping_threshold">Monto para Envío Gratis</Label>
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  defaultValue={getSetting('free_shipping_threshold')}
                  placeholder="150000"
                />
                <p className="text-sm text-gray-500">
                  Monto mínimo para activar envío gratuito (en COP)
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Calcular Impuestos en Envío</Label>
                  <p className="text-sm text-gray-500">Aplicar impuestos al costo de envío</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dirección de Origen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin_address">Dirección</Label>
                    <Input
                      id="origin_address"
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin_city">Ciudad</Label>
                    <Input
                      id="origin_city"
                      placeholder="Bogotá"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-gray-500">Enviar notificaciones automáticas</p>
                </div>
                <Switch defaultChecked={getSetting('email_notifications') === 'true'} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración SMTP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">Servidor SMTP</Label>
                    <Input
                      id="smtp_host"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">Puerto</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_username">Usuario</Label>
                    <Input
                      id="smtp_username"
                      placeholder="tu-email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">Contraseña</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Plantillas de Email</h3>
                <div className="space-y-2">
                  <Label htmlFor="welcome_email">Email de Bienvenida</Label>
                  <Textarea
                    id="welcome_email"
                    placeholder="Plantilla del email de bienvenida..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Título Meta</Label>
                <Input
                  id="meta_title"
                  placeholder="Tu Tienda de Suplementos Deportivos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Descripción Meta</Label>
                <Textarea
                  id="meta_description"
                  placeholder="Descripción para motores de búsqueda..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Palabras Clave</Label>
                <Input
                  id="meta_keywords"
                  placeholder="suplementos, proteína, fitness, nutrición"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sitemap Automático</Label>
                  <p className="text-sm text-gray-500">Generar sitemap.xml automáticamente</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Google Analytics</h3>
                <div className="space-y-2">
                  <Label htmlFor="google_analytics_id">ID de Google Analytics</Label>
                  <Input
                    id="google_analytics_id"
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}