'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSearch,
  Globe,
  GraduationCap,
  LogIn,
  Mail,
  MessageSquare,
  Shield,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const tryWeb = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Animated Background Pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#00FFFF]/20 bg-[#0A0A0A]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo_dark.png" alt="Logo" width={60} height={40} />
              <span className="text-lg font-bold text-white sm:text-xl">InnoIgniterAI</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-xs text-[#00FFFF] hover:bg-[#00FFFF]/10 hover:text-[#00FFFF] sm:px-4 sm:text-sm"
                >
                  <LogIn className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[#00FFFF] px-2 text-xs text-black hover:bg-[#00FFFF]/90 sm:px-4 sm:text-sm"
                >
                  <UserPlus className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-block rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/5 px-4 py-2">
              <span className="text-sm font-medium text-[#00FFFF]">Next-Gen AI Cybersecurity</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold text-balance sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-[#00FFFF] via-[#1A1A40] to-[#00FFFF] bg-clip-text text-transparent">
                Empowering Everyone
              </span>
              <br />
              <span className="text-white">to Stay Secure</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-balance text-gray-400 sm:text-2xl">
              Smarter, Faster, and in Real Time
            </p>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-300">
              InnoIgniterAI is an intelligent cybersecurity chatbot powered by multi-agent AI,
              combining threat detection, analysis, and education into one simple interface.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={tryWeb}
                className="group bg-[#00FFFF] px-8 py-6 text-lg text-black hover:bg-[#00FFFF]/90"
              >
                Try on Web
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                onClick={() => scrollToSection('download')}
                variant="outline"
                className="border-[#00FFFF] px-8 py-6 text-lg text-[#00FFFF] hover:bg-[#00FFFF]/10"
              >
                Download App
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#00FFFF]/50 p-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00FFFF]" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-balance sm:text-5xl">
              <span className="text-[#00FFFF]">Next-Generation</span> AI Cybersecurity Assistant
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
              InnoIgniterAI transforms how users interact with cybersecurity. It detects phishing
              URLs, malicious files, and suspicious emails while explaining threats in simple terms
              — making security accessible to everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-2xl"
          >
            <div className="flex aspect-video items-center justify-center rounded-2xl p-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#00FFFF]/20 blur-3xl" />
                <Image src="/logo_dark.png" alt="Logo" width={420} height={40} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
              Powerful <span className="text-[#00FFFF]">Features</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Comprehensive protection powered by advanced AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group h-full border-[#00FFFF]/20 bg-[#1A1A40]/30 p-6 transition-all duration-300 hover:border-[#00FFFF]/50 hover:bg-[#1A1A40]/50">
                  <div className="mb-4 inline-block rounded-lg bg-[#00FFFF]/10 p-3 transition-colors group-hover:bg-[#00FFFF]/20">
                    <feature.icon className="h-8 w-8 text-[#00FFFF]" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIEM Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden border-[#00FFFF]/30 bg-gradient-to-br from-[#1A1A40]/50 to-[#0A0A0A] p-8 sm:p-12">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#00FFFF]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-4 inline-block rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/10 px-4 py-2">
                  <span className="text-sm font-semibold text-[#00FFFF]">APP EXCLUSIVE</span>
                </div>

                <h2 className="mb-6 text-4xl font-bold text-balance text-white sm:text-5xl">
                  Advanced <span className="text-[#00FFFF]">SIEM</span> — App Only
                </h2>

                <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-300">
                  The InnoIgniterAI App includes a full Security Information and Event Management
                  (SIEM) system — enabling real-time log collection, decoding, and threat
                  correlation, all within your device. Get enterprise-grade visibility with
                  user-level simplicity.
                </p>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {siemFeatures.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#00FFFF]" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#00FFFF]/20 bg-[#00FFFF]/5 p-4">
                  <AlertTriangle className="h-5 w-5 text-[#00FFFF]" />
                  <p className="text-sm text-gray-300">
                    Available exclusively in the InnoIgniterAI App version.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => scrollToSection('download')}
                  className="bg-[#00FFFF] px-8 py-6 text-lg text-black hover:bg-[#00FFFF]/90"
                >
                  Download App Now
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold text-balance sm:text-5xl">
              Ready to <span className="text-[#00FFFF]">Ignite</span> Your Cybersecurity?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Choose your platform and start protecting yourself today
            </p>
            <p className="mx-auto mt-1 mb-12 max-w-2xl text-lg text-gray-400">
              Feature in progress
              <span className="ml-1 inline-block">
                <span className="animate-ellipsis flex w-6 justify-start"></span>
              </span>
            </p>

            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                title="App coming soon!"
                size="lg"
                disabled
                className="group bg-[#00FFFF] px-8 py-6 text-lg text-black hover:bg-[#00FFFF]/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Download for Windows
              </Button>
              <Button
                title="App coming soon!"
                size="lg"
                disabled
                variant="outline"
                className="border-[#00FFFF] bg-transparent px-8 py-6 text-lg text-[#00FFFF] hover:bg-[#00FFFF]/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Download for macOS
              </Button>
              <Button
                title="App coming soon!"
                disabled
                size="lg"
                variant="outline"
                className="border-[#00FFFF] bg-transparent px-8 py-6 text-lg text-[#00FFFF] hover:bg-[#00FFFF]/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Download for Linux
              </Button>
            </div>
            <div className="border-t border-[#00FFFF]/20 pt-8">
              <p className="mb-4 text-gray-400">Or try the web version with limited features</p>
              <Button
                onClick={tryWeb}
                size="lg"
                variant="ghost"
                className="text-[#00FFFF] hover:bg-[#00FFFF]/10"
              >
                Try on Web (Limited Features)
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#00FFFF]/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <p className="mb-2 text-sm text-gray-400">Copyright © InnoIgniterAI 2025</p>
              <p className="text-sm text-gray-500 italic">Developed by InnoIgniters@STI Team</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-[#00FFFF]">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-[#00FFFF]">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-[#00FFFF]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: 'Phishing URL Detector',
    description:
      'Instantly flags suspicious links and protects you from malicious websites in real-time.',
  },
  {
    icon: FileSearch,
    title: 'Malware File Analysis',
    description:
      'Detects and explains potential threats in files before they can harm your system.',
  },
  {
    icon: Mail,
    title: 'Phishing Email Scanner',
    description: 'Evaluates email headers and attachments to identify phishing attempts and scams.',
  },
  {
    icon: MessageSquare,
    title: 'AI-Powered Q&A',
    description:
      'Ask cybersecurity questions and get clear, contextual answers tailored to your needs.',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Communicates seamlessly in English and Myanmar for broader accessibility.',
  },
  {
    icon: GraduationCap,
    title: 'Threat Awareness Training',
    description: 'Learns from interactions and teaches you about emerging threats simultaneously.',
  },
];

const siemFeatures = [
  'Real-time event monitoring',
  'Threat correlation engine',
  'CIS/NIST compliance insights',
  'Visual alert dashboard',
];
