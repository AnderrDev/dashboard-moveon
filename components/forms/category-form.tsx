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
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { CategoryWithProducts } from '@/types/dashboard'
import { createCategoryAction, updateCategoryAction } from '@/lib/actions/categories'
import { useToast } from '@/hooks/use-toast'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  image_url: z.string().optional(),
  sort_order: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
  is_active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  mode: 'create' | 'edit'
  category?: CategoryWithProducts
  onSubmit?: (data: CategoryFormData) => Promise<void>
}

export function CategoryForm({ mode, category, onSubmit }: CategoryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: isEditMode && category ? {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    } : {
      name: '',
      slug: '',
      description: '',
      image_url: '',
      sort_order: 0,
      is_active: true,
    },
  })

  const handleSubmit = async (data: CategoryFormData) => {
    setSaving(true)
    
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else if (isEditMode && category) {
        // Lógica por defecto para editar
        const result = await updateCategoryAction(category.id, data)
        
        if (!result.success) {
          throw new Error(result.error || 'Error al actualizar la categoría')
        }
        
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente",
        })
        router.push(`/admin/categories/${category.id}`)
        router.refresh()
      } else if (isCreateMode) {
        // Lógica por defecto para crear
        const result = await createCategoryAction(data)
        
        if (!result.success) {
          throw new Error(result.error || 'Error al crear la categoría')
        }
        
        toast({
          title: "Éxito",
          description: "Categoría creada correctamente",
        })
        router.push('/admin/categories')
        router.refresh()
      }
    } catch (error) {
      console.error('Error al procesar categoría:', error)
      
      let errorMessage = 'Error al procesar la categoría'
      
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

  const backUrl = isEditMode ? `/admin/categories/${category?.id}` : '/admin/categories'
  const submitButtonText = isEditMode ? 'Guardar Cambios' : 'Crear Categoría'
  const submitButtonIcon = isEditMode ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />
  const loadingText = isEditMode ? 'Guardando...' : 'Creando...'
  const pageTitle = isEditMode ? 'Editar Categoría' : 'Nueva Categoría'
  const pageDescription = isEditMode ? category?.name : 'Crear una nueva categoría para organizar tus productos'

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
                        <FormLabel>Nombre de la Categoría</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ej: Proteínas"
                            onChange={(e) => {
                              field.onChange(e)
                              // Auto-generar slug
                              const slug = generateSlug(e.target.value)
                              form.setValue('slug', slug)
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
                          <Input {...field} placeholder="proteinas" />
                        </FormControl>
                        <FormDescription>
                          Se usa para la URL de la categoría. Se genera automáticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3} 
                            placeholder="Descripción de la categoría para SEO y navegación"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la Imagen</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/category-image.jpg" />
                        </FormControl>
                        <FormDescription>
                          URL de la imagen representativa de la categoría
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden de Visualización</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Número menor = aparece primero en la lista
                        </FormDescription>
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
                          <FormLabel>Categoría Activa</FormLabel>
                          <FormDescription>
                            La categoría será visible en la tienda
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