'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormFields {
  name:    string
  email:   string
  subject: string
  message: string
}

interface FieldError {
  name?:    string
  email?:   string
  subject?: string
  message?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// ─── Client-side validation (mirrors server) ──────────────────────────────────
function validateField(field: keyof FormFields, value: string): string {
  switch (field) {
    case 'name':
      if (!value.trim())          return 'Name is required.'
      if (value.trim().length < 2) return 'Name must be at least 2 characters.'
      return ''
    case 'email':
      if (!value.trim())          return 'Email is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
      return ''
    case 'subject':
      if (!value.trim())          return 'Subject is required.'
      if (value.trim().length < 3) return 'Subject must be at least 3 characters.'
      return ''
    case 'message':
      if (!value.trim())          return 'Message is required.'
      if (value.trim().length < 20) return 'Message must be at least 20 characters.'
      return ''
    default:
      return ''
  }
}

function validateAll(fields: FormFields): FieldError {
  const errors: FieldError = {}
  ;(Object.keys(fields) as (keyof FormFields)[]).forEach(k => {
    const e = validateField(k, fields[k])
    if (e) errors[k] = e
  })
  return errors
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({
  label, id, error, children, required = true,
}: {
  label: string; id: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
        </label>
        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-red-400 font-mono flex items-center gap-1"
            >
              <AlertCircle className="w-2.5 h-2.5" />{error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {children}
    </div>
  )
}

const inputBase = [
  'w-full rounded-xl border bg-muted/40 px-4 py-3 text-sm',
  'placeholder:text-muted-foreground/50 font-body',
  'transition-all duration-200 outline-none',
  'focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const inputError   = 'border-red-400/50 focus:ring-red-400/20 focus:border-red-400/50'
const inputDefault = 'border-border hover:border-emerald-500/30'

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 gap-5 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </motion.div>

      <div>
        <h3 className="font-display font-bold text-xl mb-1">Message sent!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
          Check your inbox for a confirmation.
        </p>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-emerald-500 transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Send another
      </button>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactForm() {
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FieldError>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [serverError, setServerError] = useState('')

  const isSubmitting = status === 'submitting'

  const handleChange = useCallback((field: keyof FormFields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const e = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: e }))
    }
  }, [touched])

  const handleBlur = useCallback((field: keyof FormFields) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const e = validateField(field, fields[field])
    setErrors(prev => ({ ...prev, [field]: e }))
  }, [fields])

  const handleSubmit = async () => {
    // Touch all fields and validate
    const allTouched = { name: true, email: true, subject: true, message: true }
    setTouched(allTouched)
    const allErrors = validateAll(fields)
    setErrors(allErrors)
    if (Object.values(allErrors).some(Boolean)) return

    setStatus('submitting')
    setServerError('')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setServerError('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setFields({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setTouched({})
    setStatus('idle')
    setServerError('')
  }

  if (status === 'success') return <SuccessState onReset={handleReset} />

  return (
    <div className="space-y-4">
      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" id="name" error={touched.name ? errors.name : undefined}>
          <input
            id="name"
            type="text"
            value={fields.name}
            onChange={e => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Jesimiel Ocam"
            disabled={isSubmitting}
            autoComplete="name"
            className={cn(inputBase, touched.name && errors.name ? inputError : inputDefault)}
          />
        </Field>

        <Field label="Email address" id="email" error={touched.email ? errors.email : undefined}>
          <input
            id="email"
            type="email"
            value={fields.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="you@example.com"
            disabled={isSubmitting}
            autoComplete="email"
            className={cn(inputBase, touched.email && errors.email ? inputError : inputDefault)}
          />
        </Field>
      </div>

      {/* Subject */}
      <Field label="Subject" id="subject" error={touched.subject ? errors.subject : undefined}>
        <input
          id="subject"
          type="text"
          value={fields.subject}
          onChange={e => handleChange('subject', e.target.value)}
          onBlur={() => handleBlur('subject')}
          placeholder="Let's build something together"
          disabled={isSubmitting}
          className={cn(inputBase, touched.subject && errors.subject ? inputError : inputDefault)}
        />
      </Field>

      {/* Message with char counter */}
      <Field label="Message" id="message" error={touched.message ? errors.message : undefined}>
        <div className="relative">
          <textarea
            id="message"
            rows={5}
            value={fields.message}
            onChange={e => handleChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            placeholder="Tell me about your project, timeline, or just say hi..."
            disabled={isSubmitting}
            maxLength={5000}
            className={cn(
              inputBase, 'resize-none',
              touched.message && errors.message ? inputError : inputDefault
            )}
          />
          {/* Char counter */}
          <span className={cn(
            'absolute bottom-2.5 right-3 text-[10px] font-mono transition-colors',
            fields.message.length > 4500 ? 'text-red-400' : 'text-muted-foreground/40'
          )}>
            {fields.message.length}/5000
          </span>
        </div>
      </Field>

      {/* Server error */}
      <AnimatePresence>
        {status === 'error' && serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-400/30 bg-red-400/5 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        size="lg"
        className="w-full gap-2 shadow-lg shadow-emerald-500/20 transition-all"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting ? (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <p className="text-[10px] text-muted-foreground font-mono text-center">
        I typically respond within 24 hours.
      </p>
    </div>
  )
}
