import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        Public demo · Fictional store and synthetic metrics · No customer data
      </footer>
    </div>
  )
}
