import React from 'react'

export default function Footer() {
  return (
     <footer className="border-t border-[#E8E2D9] px-6 py-10 dark:border-white/10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="font-mono text-sm text-[#1A1714] dark:text-[#F5F1EB]">
          Found<span className="text-[#D4622A]">hub</span>
        </span>

        <p className="text-xs text-[#C4B9A8] dark:text-[#8E8377]">
          Founder workspace control
        </p>
      </div>
    </footer>
  )
}
