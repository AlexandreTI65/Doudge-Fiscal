'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, MoveRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const comparisons = [
  {
    id: 1,
    title: 'Retrofit Fachada Comercial',
    desc: 'Modernização completa da fachada com pele de vidro e revestimento em ACM, valorizando o imóvel em 40%.',
    before: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Interiores Escritório Open Space',
    desc: 'Transformação de layout tradicional para conceito aberto, melhorando a colaboração e iluminação natural.',
    before: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Revitalização Residencial',
    desc: 'Reforma integral de apartamento antigo, integrando sala e cozinha para maior amplitude.',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Galpão Industrial',
    desc: 'Recuperação estrutural e adequação de piso para alta tonelagem.',
    before: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function AntesDepoisPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop"
          alt="Antes e Depois Obras"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <motion.div
          className="relative z-10 text-center space-y-6 px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/30 text-lg px-4 py-1 backdrop-blur-md border-primary/50">
            Resultados Comprovados
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Transformação <span className="text-primary">Real</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Veja o impacto da nossa engenharia. Do projeto à execução, a diferença está nos detalhes.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 space-y-24">
        {comparisons.map((item, index) => (
          <motion.div
            key={item.id}
            className="space-y-8 scroll-m-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary pl-6">
               <div className="space-y-2">
                 <h2 className="text-3xl font-bold text-foreground">{item.title}</h2>
                 <p className="text-muted-foreground text-lg max-w-2xl">{item.desc}</p>
               </div>
               <div className="hidden md:block">
                  <Badge variant="outline" className="text-lg px-4 py-1 border-primary/20 text-primary uppercase tracking-widest">
                    Case {index + 1}
                  </Badge>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Antes */}
              <motion.div className="relative group rounded-2xl overflow-hidden shadow-xl aspect-video" whileHover={{ y: -4 }}>
                <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> ANTES
                </div>
                <Image 
                  src={item.before} 
                  alt="Antes da obra" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"/>
              </motion.div>

              {/* Depois */}
              <motion.div className="relative group rounded-2xl overflow-hidden shadow-2xl aspect-video ring-4 ring-primary/10 hover:ring-primary/30 transition-all duration-500" whileHover={{ y: -4 }}>
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"/> DEPOIS
                </div>
                <Image 
                  src={item.after} 
                  alt="Depois da obra" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                />
              </motion.div>
            </div>
            
            {/* Visual connector for mobile */}
            <div className="flex md:hidden justify-center text-muted-foreground/50">
               <MoveRight className="w-8 h-8 rotate-90" />
            </div>
            
            {index < comparisons.length - 1 && (
               <div className="hidden md:block w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-12"/>
            )}
          </motion.div>
        ))}
      </div>

       <motion.div
        className="bg-muted py-16 mt-12 rounded-3xl container mx-auto text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.3 }}
       >
        <h3 className="text-3xl font-bold">Gostou do Resultado?</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">Sua obra pode ser o próximo caso de sucesso. Entre em contato e agende uma visita técnica.</p>
        <Link href="/obras/orcamento">
          <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20 rounded-full hover:scale-105 transition-transform">
            Solicitar Orçamento Agora <ArrowRight className="ml-2 w-5 h-5"/>
          </Button>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
