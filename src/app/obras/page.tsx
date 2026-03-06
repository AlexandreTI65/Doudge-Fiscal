'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Hammer, PaintBucket, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ObrasPage() {
  return (
    <div className="flex flex-col gap-16 pb-24 text-foreground">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
          alt="Obras e Reformas"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <motion.div
          className="relative z-10 text-center space-y-6 px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
           <div className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1 text-white text-sm font-semibold mb-2">
             Excelência em Construção Civil
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
             Construindo <span className="text-primary">Legados</span>
           </h1>
           <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-md">
             Transformamos ideias em realidade com projetos exclusivos e execução impecável.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/obras/portfolio">
              <Button size="lg" className="h-14 px-8 w-full sm:w-auto text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform bg-primary text-primary-foreground border-0">
                Ver Portfólio
              </Button>
            </Link>
            <Link href="/obras/orcamento">
              <Button size="lg" variant="outline" className="h-14 px-8 w-full sm:w-auto text-lg font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-20">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {[
            { icon: Hammer, title: "Reformas Residenciais", desc: "Do projeto à entrega das chaves." },
            { icon: Building2, title: "Reformas Comerciais", desc: "Soluções ágeis para seu negócio." },
            { icon: PaintBucket, title: "Pintura e Acabamento", desc: "Detalhes que fazem a diferença." },
            { icon: Wrench, title: "Manutenção", desc: "Preventiva e corretiva." },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
              whileHover={{ y: -6 }}
            >
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-card/95 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold leading-tight">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                <CardDescription className="text-sm sm:text-base leading-relaxed">{item.desc}</CardDescription>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Featured Project Preview */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="space-y-2">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Destaques Recentes</h2>
             <p className="text-muted-foreground text-base sm:text-lg">Confira a qualidade do nosso acabamento.</p>
           </div>
           <Link href="/obras/portfolio" className="group flex items-center text-primary font-bold hover:underline">
             Ver todos os projetos <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"/>
           </Link>
        </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
             className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.45, delay: 0.05 }}
             viewport={{ once: true }}
             whileHover={{ y: -6 }}
            >
              <Image 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" 
                alt="Projeto 1" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                 <div className="text-white">
                    <h3 className="text-xl font-bold">Residência Alphaville</h3>
                    <p className="text-white/80">Reforma Completa</p>
                 </div>
              </div>
           </motion.div>
           <motion.div
             className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-pointer md:-mt-12"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.45, delay: 0.12 }}
             viewport={{ once: true }}
             whileHover={{ y: -6 }}
           >
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Projeto 2" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                 <div className="text-white">
                    <h3 className="text-xl font-bold">Sede Tech Faria Lima</h3>
                    <p className="text-white/80">Corporativo</p>
                 </div>
              </div>
           </motion.div>
           <motion.div
             className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.45, delay: 0.19 }}
             viewport={{ once: true }}
             whileHover={{ y: -6 }}
           >
              <Image 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                alt="Projeto 3" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                 <div className="text-white">
                    <h3 className="text-xl font-bold">Apartamento Vila Nova</h3>
                    <p className="text-white/80">Interiores</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
