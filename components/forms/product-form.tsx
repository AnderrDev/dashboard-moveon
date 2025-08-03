'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { ProductWithCategory, CategoryWithProducts } from '@/types/dashboard'
import { updateProductAction, createProductAction } from '@/lib/actions/products'
import { useToast } from '@/hooks/use-toast'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  compare_price: z.number().min(0, 'El precio comparativo debe ser 0 o mayor').optional(),
  cost_price: z.number().min(0, 'El precio de costo debe ser mayor a 0').optional(),
  stock_quantity: z.number().min(0, 'El stock no puede ser negativo'),
  low_stock_threshold: z.number().min(0, 'El umbral no puede ser negativo'),
  brand: z.string().optional(),
  weight: z.number().optional(),
  serving_size: z.string().optional(),
  servings_per_container: z.number().optional(),
  category_id: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  tags: z.string().optional(),
  ingredients: z.string().optional(),
}).refine((data) => {
  // Validar que el precio comparativo sea 0 o mayor al precio de venta
  if (data.compare_price && data.compare_price > 0) {
    return data.compare_price > data.price
  }
  return true
}, {
  message: "El precio comparativo debe ser 0 o mayor al precio de venta",
  path: ["compare_price"]
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: ProductWithCategory
  categories?: CategoryWithProducts[]
  onSubmit?: (data: ProductFormData) => Promise<void>
}

export function ProductForm({ mode, product, categories = [], onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditMode && product ? {
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku,
      price: product.price,
      compare_price: product.compare_price || 0,
      cost_price: product.cost_price || 0,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      brand: product.brand || '',
      weight: product.weight || 0,
      serving_size: product.serving_size || '',
      servings_per_container: product.servings_per_container || 0,
      category_id: product.category?.id || '',
      is_active: product.is_active,
      is_featured: product.is_featured,
      tags: product.tags.join(', '),
      ingredients: product.ingredients.join(', '),
    } : {
      name: '',
      slug: '',
      description: '',
      short_description: '',
      sku: '',
      price: 0,
      compare_price: 0,
      cost_price: 0,
      stock_quantity: 0,
      low_stock_threshold: 5,
      brand: '',
      weight: 0,
      serving_size: '',
      servings_per_container: 0,
      category_id: '',
      is_active: true,
      is_featured: false,
      tags: '',
      ingredients: '',
    },
  })

  const handleSubmit = async (data: ProductFormData) => {
    setSaving(true)
    
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else if (isEditMode && product) {
        // Lógica por defecto para editar
        const updateData = {
          ...data,
          compare_price: (data.compare_price || 0) > 0 ? data.compare_price : null,
          cost_price: (data.cost_price || 0) > 0 ? data.cost_price : null,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          ingredients: data.ingredients ? data.ingredients.split(',').map(ingredient => ingredient.trim()) : [],
          nutritional_info: product.nutritional_info,
          images: product.images,
        }

        const result = await updateProductAction(product.id, updateData)
        
        if (!result.success) {
          throw new Error(result.error || 'Error al actualizar el producto')
        }
        
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        })
        router.push(`/admin/products/${product.id}`)
        router.refresh()
      } else if (isCreateMode) {
        // Lógica por defecto para crear
        const createData = {
          ...data,
          category_id: data.category_id || null,
          compare_price: (data.compare_price || 0) > 0 ? data.compare_price : null,
          cost_price: (data.cost_price || 0) > 0 ? data.cost_price : undefined,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          ingredients: data.ingredients ? data.ingredients.split(',').map(ingredient => ingredient.trim()) : [],
        }

        const result = await createProductAction(createData)
        
        if (!result.success) {
          throw new Error(result.error || 'Error al crear el producto')
        }
        
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        })
        router.push('/admin/products')
        router.refresh()
      }
    } catch (error) {
      console.error('Error al procesar producto:', error)
      
      // Manejar errores específicos de la base de datos
      let errorMessage = 'Error al procesar el producto'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const generateSKU = (name: string) => {
    const words = name.split(' ')
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${initials}-${random}`
  }

  const availableCategories = categories.length > 0 ? categories : []
  const backUrl = isEditMode ? `/admin/products/${product?.id}` : '/admin/products'
  const submitButtonText = isEditMode ? 'Guardar Cambios' : 'Crear Producto'
  const submitButtonIcon = isEditMode ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />
  const loadingText = isEditMode ? 'Guardando...' : 'Creando...'
  const pageTitle = isEditMode ? 'Editar Producto' : 'Nuevo Producto'
  const pageDescription = isEditMode ? product?.name : 'Crear un nuevo producto para tu tienda'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={backUrl}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600">{pageDescription}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Producto</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ej: Proteína Whey Gold 2.2kg"
                            onChange={(e) => {
                              field.onChange(e)
                              // Auto-generar slug y SKU
                              const slug = generateSlug(e.target.value)
                              const sku = generateSKU(e.target.value)
                              form.setValue('slug', slug)
                              if (isCreateMode && !form.getValues('sku')) {
                                form.setValue('sku', sku)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="proteina-whey-gold-2200g" />
                        </FormControl>
                        <FormDescription>
                          Se usa para la URL del producto. Se genera automáticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Corta</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={2} 
                            placeholder="Descripción breve que aparece en listados de productos"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Completa</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                            placeholder="Descripción detallada del producto, beneficios, modo de uso, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Precios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de Venta *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="89990"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Precio en COP</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compare_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Comparativo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="99990"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Precio antes del descuento</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de Costo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="65000"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Para cálculo de márgenes</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stock_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad en Stock *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="50"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="low_stock_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Umbral de Stock Bajo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="5"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Alerta cuando el stock sea menor</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PWG-001" />
                        </FormControl>
                        <FormDescription>Código único del producto</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="NutriMax" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (gramos)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="2200"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serving_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamaño de Porción</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="30g" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servings_per_container"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porciones por Envase</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="73"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiquetas</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="proteína, whey, músculo, recuperación" />
                        </FormControl>
                        <FormDescription>Separar con comas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredientes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3} 
                            placeholder="Concentrado de proteína de suero, Aislado de proteína de suero, Saborizantes naturales, Stevia"
                          />
                        </FormControl>
                        <FormDescription>Separar con comas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Producto Activo</FormLabel>
                          <FormDescription>
                            El producto será visible en la tienda
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Producto Destacado</FormLabel>
                          <FormDescription>
                            Aparecerá en secciones especiales
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableCategories.map((category: CategoryWithProducts) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {loadingText}
                      </>
                    ) : (
                      <>
                        {submitButtonIcon}
                        {submitButtonText}
                      </>
                    )}
                  </Button>
                  <Link href={backUrl} className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 