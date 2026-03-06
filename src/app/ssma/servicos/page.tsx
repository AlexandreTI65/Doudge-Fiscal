'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, FileCheck, HeartPulse, ActivitySquare, TreePine, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { 
    title: "PGR", 
    desc: "Programa de Gerenciamento de Riscos. Identificação completa, avaliação e controle dos riscos ocupacionais.",
    image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2069&auto=format&fit=crop",
    icon: <Settings className="w-10 h-10 text-green-600"/>
  },
  { 
    title: "LTCAT", 
    desc: "Laudo Técnico das Condições Ambientais do Trabalho. Documento essencial para fins de aposentadoria especial.",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop",
    icon: <FileCheck className="w-10 h-10 text-green-600"/>
  },
  { 
    title: "PCMSO", 
    desc: "Programa de Controle Médico de Saúde Ocupacional. Monitoramento da saúde integral dos colaboradores.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
    icon: <HeartPulse className="w-10 h-10 text-green-600"/>
  },
  { 
    title: "Laudo Ergonômico", 
    desc: "Análise Ergonômica do Trabalho (AET). Adaptação das condições de trabalho às características psicofisiológicas.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    icon: <ActivitySquare className="w-10 h-10 text-green-600"/>
  },
  { 
    title: "Gestão Ambiental", 
    desc: "Licenciamento, PGRS (Resíduos Sólidos) e consultoria para conformidade ambiental.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
    icon: <TreePine className="w-10 h-10 text-green-600"/>
  },
  { 
    title: "Perícias Técnicas", 
    desc: "Assistência técnica em perícias trabalhistas de insalubridade e periculosidade.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    icon: <Scale className="w-10 h-10 text-green-600"/>
  },
];

export default function SSMAServicosPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
          alt="Serviços SSMA"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <motion.div
          className="relative z-10 text-center space-y-4 px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Soluções Completas em SSMA</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Excelência técnica e conformidade legal para garantir a segurança e sustentabilidade do seu negócio.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {services.map((service, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            whileHover={{ y: -6 }}
          >
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-card flex flex-col h-full rounded-2xl shadow-sm hover:-translate-y-1">
            <div className="relative h-48 w-full overflow-hidden">
               <div className="absolute inset-0 bg-green-900/10 group-hover:bg-green-900/0 transition-colors z-10"/>
               <Image 
                 src={service.image} 
                 alt={service.title} 
                 fill 
                 className="object-cover transform group-hover:scale-110 transition-transform duration-700"
               />
            </div>
            <CardHeader className="pb-2">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">{service.icon}</div>
               </div>
               <CardTitle className="text-xl font-bold text-foreground group-hover:text-green-600 transition-colors">
                 {service.title}
               </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
