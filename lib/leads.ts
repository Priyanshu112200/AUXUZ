import { supabase } from './supabase'

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'APPOINTMENT' | 'WON' | 'LOST'
export type LeadInput = { name: string; email: string; phone: string; company: string; website: string; service: string; message: string; source?: string }
export type LeadRecord = LeadInput & { id: string; created_at: string; updated_at: string; source: string; status: LeadStatus; score: number; next_followup_at: string | null; appointment_at: string | null; notes: string | null }

export function scoreLead(input: LeadInput) {
  let score = 30
  const text = `${input.message} ${input.service}`.toLowerCase()
  if (input.email.includes('@')) score += 10
  if (input.phone.trim().length >= 8) score += 10
  if (input.website.trim()) score += 10
  if (/leads|crm|automation|website|conversion|sales|acquisition|follow/.test(text)) score += 15
  if (input.message.trim().length >= 100) score += 10
  return Math.min(100, score)
}

export async function createLead(input: LeadInput) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const score = scoreLead(input)
  const { data, error } = await supabase.from('leads').insert({ ...input, source: input.source || 'website', score, status: 'NEW' }).select('id').single()
  if (error) throw error
  return data.id as string
}
