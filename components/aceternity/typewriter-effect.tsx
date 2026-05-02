'use client'
import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
}: {
  words: { text: string; className?: string }[]
  className?: string
  cursorClassName?: string
}) {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }))

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (isInView) setStarted(true)
  }, [isInView])

  const renderWords = () => (
    <motion.div ref={ref} className="inline">
      {wordsArray.map((word, wIdx) => (
        <div key={`word-${wIdx}`} className="inline-block">
          {word.text.map((char, cIdx) => (
            <motion.span
              key={`char-${cIdx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.08,
                delay: wordsArray
                  .slice(0, wIdx)
                  .reduce((acc, w) => acc + w.text.length, 0) *
                  0.04 +
                  cIdx * 0.04,
              }}
              className={cn('', word.className)}
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </div>
      ))}
    </motion.div>
  )

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn(
          'inline-block h-[1em] w-[2px] rounded-full bg-emerald-500',
          cursorClassName
        )}
      />
    </div>
  )
}

// Simpler looping typewriter for hero
export function TypewriterLoop({
  strings,
  className,
}: {
  strings: string[]
  className?: string
}) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = strings[wordIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (charIdx < word.length) {
        timeout = setTimeout(() => {
          setDisplay(word.slice(0, charIdx + 1))
          setCharIdx((c) => c + 1)
        }, 75)
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200)
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplay(word.slice(0, charIdx - 1))
          setCharIdx((c) => c - 1)
        }, 40)
      } else {
        setDeleting(false)
        setWordIdx((i) => (i + 1) % strings.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, strings])

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span>{display}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-emerald-500 rounded-full"
      />
    </span>
  )
}
