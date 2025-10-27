"use client"

import { motion } from "framer-motion"
import { Shield, Wrench, Clock, Mail } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(#00FFFF 1px, transparent 1px),
            linear-gradient(90deg, #00FFFF 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#1A1A40]/40 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Shield icon with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full" />
            <Shield className="w-24 h-24 text-cyan-400 relative" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-white"
        >
          System Under
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Maintenance
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-lg mb-12 leading-relaxed"
        >
          We're currently upgrading our security infrastructure to serve you better. Our AI-powered systems will be back
          online shortly.
        </motion.p>

        {/* Status cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-[#1A1A40]/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors">
            <Wrench className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Upgrading</h3>
            <p className="text-gray-400 text-sm">System Enhancement</p>
          </div>

          <div className="bg-[#1A1A40]/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">ETA</h3>
            <p className="text-gray-400 text-sm">2-4 Hours</p>
          </div>

          <div className="bg-[#1A1A40]/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors">
            <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Contact</h3>
            <p className="text-gray-400 text-sm">support@innoigniters.ai</p>
          </div>
        </motion.div>

        {/* Loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center items-center gap-2"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full"
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
          <span className="text-cyan-400 text-sm ml-2">Processing...</span>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-gray-500 text-sm mt-12"
        >
          Thank you for your patience. We'll be back stronger and more secure.
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
  )
}
