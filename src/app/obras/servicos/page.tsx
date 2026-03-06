'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Hammer, Building2, Key, RefreshCcw, Wrench, DraftingCompass } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { 
    title: "Construção Residencial", 
    desc: "Casas de alto padrão com metodologia construtiva avançada e acompanhamento completo.",
    image: "https://images.unsplash.com/photo-1600596542815-60c37cabc53d?q=80&w=2075&auto=format&fit=crop",
    icon: <Hammer className="w-8 h-8"/>
  },
  { 
    title: "Reformas Comerciais", 
    desc: "Lojas, escritórios e galpões. Execução rápida e limpa para minimizar o impacto no seu negócio.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    icon: <Building2 className="w-8 h-8"/>
  },
  { 
    title: "Turnkey (Chave na Mão)", 
    desc: "Gerenciamos tudo, do projeto executivo à entrega das chaves. Zero dor de cabeça para você.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
    icon: <Key className="w-8 h-8"/>
  },
  { 
    title: "Retrofit Predial", 
    desc: "Modernização de fachadas e sistemas prediais, valorizando o patrimônio e reduzindo custos.",
    image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=2006&auto=format&fit=crop",
    icon: <RefreshCcw className="w-8 h-8"/>
  },
  { 
    title: "Manutenção Corporativa", 
    desc: "Contratos mensais para manutenção preventiva e corretiva de instalações e acabamentos.",
    image: "https://images.unsplash.com/photo-1581094794320-c914654603df?q=80&w=2070&auto=format&fit=crop",
    icon: <Wrench className="w-8 h-8"/>
  },
  { 
    title: "Projetos Arquitetônicos", 
    desc: "Parceria com os melhores escritórios de arquitetura para concept design e aprovações legais.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop",
    icon: <DraftingCompass className="w-8 h-8"/>
  },
];

export default function ObrasServicosPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2076&auto=format&fit=crop"
          alt="Serviços em Obras"
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
          <Badge className="bg-primary/20 text-primary-foreground backdrop-blur-sm border-primary/50 text-base px-4 py-1">
             Nossa Expertise
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Soluções Construtivas</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Da fundação ao acabamento, oferecemos excelência técnica e gestão eficiente.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {services.map((service, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
            whileHover={{ y: -6 }}
          >
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden bg-card flex flex-col h-full rounded-2xl shadow-lg hover:-translate-y-2">
            <div className="relative h-56 w-full overflow-hidden">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"/>
               <Image 
                 src={service.image} 
                 alt={service.title} 
                 fill 
                 className="object-cover transform group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg z-20 shadow-md text-primary">
                  {service.icon}
               </div>
            </div>
            <CardHeader className="pb-2">
               <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                 {service.title}
               </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
              <Link href="/obras/orcamento" className="w-full">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                  Solicitar Cotação
                </Button>
              </Link>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
