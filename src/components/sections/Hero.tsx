'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Drill, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: 'easeOut' as const,
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0.01 : 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background - Horizontal Split (Top/Bottom) */}
      <div className="absolute inset-0 z-0 flex flex-col">
        {/* Top Half: Obras */}
        <motion.div
          className="relative w-full h-1/2"
          initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 1.2, ease: 'easeOut' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
            alt="Engenharia e Construção"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
           <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
           {/* Fade at bottom of top image to blend */}
           <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        </motion.div>
        
        {/* Bottom Half: SSMA */}
        <motion.div
          className="relative w-full h-1/2"
          initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 1.2, delay: prefersReducedMotion ? 0 : 0.1, ease: 'easeOut' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Segurança do Trabalho"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply" />
          {/* Fade at top of bottom image to blend */}
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-transparent to-transparent opacity-80" />
        </motion.div>
        
        {/* Dark overlay in the center for text */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, -3, 0] }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse custom-pulse" />
            <span className="font-bold tracking-wider">ENGENHARIA & SSMA</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-tight">
            Construção Sólida.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary">Operação Segura.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-200 leading-relaxed font-light drop-shadow-md">
            Unimos a expertise técnica da engenharia civil com o rigor das normas de segurança para entregar resultados superiores.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link href="/obras">
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
              <Button size="lg" className="h-16 px-12 text-lg font-bold gap-3 w-full sm:w-auto shadow-2xl shadow-primary/30 hover:scale-105 transition-all bg-primary text-primary-foreground border-0 rounded-full group">
                <Drill className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Obras
              </Button>
              </motion.div>
            </Link>
            <Link href="/ssma">
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-bold gap-3 w-full sm:w-auto bg-green-600/20 text-white border-green-500/50 hover:bg-green-600 hover:border-green-600 hover:text-white backdrop-blur-md rounded-full hover:scale-105 transition-all group">
                <ShieldCheck className="w-6 h-6 text-green-400 group-hover:text-white transition-colors" />
                SSMA
              </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
