'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Mail, Shield, Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(#00FFFF 1px, transparent 1px),
            linear-gradient(90deg, #00FFFF 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite',
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
      <div
        className="absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-[#1A1A40]/40 blur-3xl"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        {/* Shield icon with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative h-36 w-full">
            <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl" />
            <Image src="/logo_dark.png" alt="Logo" fill className="object-contain" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-5xl font-bold text-white md:text-6xl"
        >
          System Under
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Maintenance
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 text-lg leading-relaxed text-gray-400"
        >
          We're currently upgrading our security infrastructure to serve you better. Our AI-powered
          systems will be back online shortly.
        </motion.p>

        {/* Status cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-lg border border-cyan-500/20 bg-[#1A1A40]/30 p-6 backdrop-blur-sm transition-colors hover:border-cyan-500/40">
            <Wrench className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
            <h3 className="mb-2 font-semibold text-white">Upgrading</h3>
            <p className="text-sm text-gray-400">System Enhancement</p>
          </div>

          <div className="rounded-lg border border-cyan-500/20 bg-[#1A1A40]/30 p-6 backdrop-blur-sm transition-colors hover:border-cyan-500/40">
            <Clock className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
            <h3 className="mb-2 font-semibold text-white">ETA</h3>
            <p className="text-sm text-gray-400">10-12 Hours</p>
          </div>

          <div className="rounded-lg border border-cyan-500/20 bg-[#1A1A40]/30 p-6 backdrop-blur-sm transition-colors hover:border-cyan-500/40">
            <Mail className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
            <h3 className="mb-2 font-semibold text-white">Contact</h3>
            <p className="text-sm text-gray-400">support@innoigniters.ai</p>
          </div>
        </motion.div>

        {/* Loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-3 w-3 rounded-full bg-cyan-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-cyan-400">Processing...</span>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="my-6 flex flex-col gap-3 text-sm text-gray-500"
        >
          <Link href={'/'}>
            <span className="pb-3 text-blue-600 capitalize underline">Click here to home page</span>
          </Link>
          <span>Thank you for your patience. We'll be back stronger and more secure.</span>
        </motion.p>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}
