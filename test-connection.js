const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hqfkzqzygilbjjnphlyi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZmt6cXp5Z2lsYmpqbnBobHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzMyOTQsImV4cCI6MjA2OTUwOTI5NH0.axp0yD_g3twLghw0nAnv0zX1pynSSZ7rBNCjqKYW8VA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...')
    
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Error:', error.message)
      console.log('📋 Necesitas crear las tablas en Supabase')
    } else {
      console.log('✅ Conexión exitosa!', data)
    }
  } catch (error) {
    console.log('❌ Error general:', error.message)
  }
}

testConnection()