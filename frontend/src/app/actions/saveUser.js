'use server'

import { supabase } from '@/lib/supabase'

export async function saveUserToDB({ id, email, name }) {
  // check if exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', id)
    .single()

  if (!existing) {
    await supabase.from('users').insert({
      id,
      email,
      name,
    })
  }

  return { success: true }
}