'use client';

import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const trainings = [
  {
    title: "NR-10 Básico e SEP",
    desc: "Segurança em Instalações e Serviços em Eletricidade. Teórico e prático com simuladores.",
    hours: "40 horas",
    bg: "https://images.unsplash.com/photo-1596468138865-673aa6f1c4df?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "NR-35 Trabalho em Altura",
    desc: "Plano de resgate e técnicas de acesso por corda. Equipamentos certificados.",
    hours: "08 horas",
    bg: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "NR-33 Espaço Confinado",
    desc: "Vigia e supervisor de entrada. Monitoramento atmosférico e resgate.",
    hours: "16h / 40h",
    bg: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?q=80&w=2069&auto=format&fit=crop"
  },
  {
    title: "Brigada de Incêndio",
    desc: "Prevenção e combate a incêndio, evacuação e primeiros socorros.",
    hours: "Conforme IT",
    bg: "https://images.unsplash.com/photo-1566418366928-85474ca6bb6a?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "CIPA (NR-05)",
    desc: "Comissão Interna de Prevenção de Acidentes. Formação de cipeiros e designados.",
    hours: "20 horas",
    bg: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Operação de Máquinas",
    desc: "Empilhadeira, Ponte Rolante, Plataforma Elevatória e PTA.",
    hours: "Varia",
    bg: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?q=80&w=2070&auto=format&fit=crop"
  },
];

export default function TreinamentosPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 space-y-16">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-bold text-foreground">Treinamentos e Capacitação</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Equipe preparada é equipe segura. Treinamentos In-Company com instrutores certificados.</p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {trainings.map((item, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            whileHover={{ y: -6 }}
          >
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-card overflow-hidden group h-full flex flex-col rounded-2xl relative">
            <div className="relative h-60 w-full">
              <Image 
                src={item.bg} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-4">
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                   {item.title}
                </h3>
                <div className="flex items-center text-green-300 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.hours}
                </div>
              </div>
            </div>
            
            <CardContent className="pt-6 flex-1 px-6 pb-8">
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Link href="/ssma/contato">
           <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
           <Button size="lg" className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg font-bold text-lg rounded-full">
             Orçamento para Treinamento In-Company
           </Button>
           </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
