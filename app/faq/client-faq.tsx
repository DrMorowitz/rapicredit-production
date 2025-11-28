'use client'

import { useState } from 'react'
import { faqs } from './faq-data'

export default function ClientFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {faqs.map((item, index) => (
        <article
          key={item.question}
          className="rounded-3xl border border-orange-100 bg-white/90 shadow-sm shadow-rapicredit-primary/5 transition hover:shadow-orange-200 overflow-hidden"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-orange-50 transition-colors group"
          >
            <h2 className="text-base font-semibold text-rapicredit-secondary md:text-lg group-hover:text-orange-700 transition-colors">
              {item.question}
            </h2>
            <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-6 pb-5 border-t border-orange-100">
              <p className="pt-4 text-sm text-gray-600 md:text-base leading-relaxed">{item.answer}</p>
            </div>
          </div>
        </article>
      ))}
    </>
  )
}