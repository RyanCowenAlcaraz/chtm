"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Cormorant, Inter } from "next/font/google";
import chtmlogo from '../images/chtmlogo.png'
import gc from '../images/gc.png'
import loginchtmbg from '../images/loginchtmbg.jpg'
import { supabase } from "../../lib/supabaseClient";

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    setLoading(true)

    // Validate student number format (should be numbers only)
    if (!/^\d+$/.test(studentNumber)) {
      setError("Student number must contain only numbers")
      setLoading(false)
      return
    }

    // Combine student number with domain
    const fullEmail = `${studentNumber}@gordoncollege.edu.ph`;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: fullEmail,
        password,
      })

      setLoading(false)

      if (signInError) {
        setError("Invalid student number or password")
        return
      }

      // Signed in successfully — redirect to home
      router.replace('/home')
    } catch (err: any) {
      setLoading(false)
      setError('An unexpected error occurred')
    }
  };

  const handleStudentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    setStudentNumber(value);
    if (error) setError(null);
  };

  return (
    <div className={`flex min-h-screen ${inter.className}`}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${loginchtmbg.src}')`
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center p-2">
              <Image src={chtmlogo} alt="CHTM Logo" width={112} height={112} className="object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Montserrat, serif', color: '#FF0080' }}>CHTM-RRS</h1>
              <p className="text-base font-medium mt-1 tracking-wide" style={{ fontFamily: 'Inter, serif' }}>ROOM RESERVATION SYSTEM</p>
            </div>
            <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center p-2">
              <Image 
                src={gc} 
                alt="GC Logo" 
                width={112} 
                height={112} 
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
          <p 
            className={`text-left flex items-center mt-8 ${inter.className}`}
            style={{
              width: '430px',
              height: '96px',
              fontWeight: 500,
              fontSize: '17px',
              lineHeight: '32px',
              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}
          >
            "Enhancing service excellence through the College of Hospitality and Tourism Management"
          </p>
          <div className="w-48 h-1 bg-pink-600 mt-4 self-start" style={{ marginLeft: 'calc((100% - 430px) / 2)' }}></div>
          <p className="mt-6 text-white text-sm font-semibold self-start" style={{ marginLeft: 'calc((100% - 430px) / 2)' }}>
            CHTM Department
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl px-8">
          <div className="mb-12">
            <h2 className={`text-5xl font-light mb-2 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>Welcome Back</h2>
            <div className="w-64 h-1 bg-pink-600 mb-3"></div>
            <p className="text-gray-600 text-base font-medium">
              Please sign in with your student number to access your reservation details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Student Number<span className="text-pink-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="studentNumber"
                  type="text"
                  value={studentNumber}
                  onChange={handleStudentNumberChange}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent bg-white text-black pr-52"
                  placeholder="Enter your student number"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">
                  @gordoncollege.edu.ph
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your student number only (e.g., 202312345)
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password<span className="text-pink-600">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent bg-white text-black"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 px-4 text-lg rounded-md transition-colors font-medium tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#3D5A4C' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2d4339' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#3D5A4C' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600" role="alert">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 GCATTEND. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}