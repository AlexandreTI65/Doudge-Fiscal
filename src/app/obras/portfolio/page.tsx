'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const categories = ["Todos", "Residencial", "Comercial", "Industrial"];

const projects = [
  { 
    id: 1, 
    title: 'Residência Alto Padrão', 
    location: 'Alphaville, SP', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    desc: 'Reforma completa com automação e acabamentos premium.'
  },
  { 
    id: 2, 
    title: 'Sede Corporativa Tech', 
    location: 'Faria Lima, SP', 
    category: 'Comercial', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    desc: 'Espaço colaborativo open-space com isolamento acústico.'
  },
  { 
    id: 3, 
    title: 'Galpão Logístico', 
    location: 'Cajamar, SP', 
    category: 'Industrial', 
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    desc: 'Estrutura metálica e piso de alta resistência.'
  },
  { 
    id: 4, 
    title: 'Loja Conceito', 
    location: 'Oscar Freire, SP', 
    category: 'Comercial', 
    image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=2787&auto=format&fit=crop',
    desc: 'Fachada em vidro e iluminação cênica.'
  },
  { 
    id: 5, 
    title: 'Apartamento Duplex', 
    location: 'Vila Nova Conceição, SP', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    desc: 'Integração de ambientes e marcenaria sob medida.'
  },
  { 
    id: 6, 
    title: 'Centro de Distribuição', 
    location: 'Guarulhos, SP', 
    category: 'Industrial', 
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop',
    desc: 'Instalações elétricas industriais e AVCB.'
  },
  { 
    id: 7, 
    title: 'Cozinha Gourmet', 
    location: 'Moema, SP', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
    desc: 'Modernização com ilha central e eletros embutidos.'
  },
  { 
    id: 8, 
    title: 'Escritório Advocacia', 
    location: 'Paulista, SP', 
    category: 'Comercial', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    desc: 'Salas de reunião privativas e recepção imponente.'
  },
  { 
    id: 9, 
    title: 'Penthouse Moderna', 
    location: 'Itaim Bibi, SP', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    desc: 'Varanda gourmet e piscina privativa.'
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects = projects.filter(project => 
    activeCategory === "Todos" ? true : project.category === activeCategory
  );

  const getCardClasses = (index: number) => {
    if (index === 0) return 'sm:col-span-2 xl:col-span-8 xl:row-span-2';
    if (index === 1 || index === 2) return 'xl:col-span-4 xl:row-span-1';
    return 'xl:col-span-4 xl:row-span-1';
  };

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop"
          alt="Portfólio de Obras"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <motion.div
          className="relative z-10 text-center space-y-6 px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.55, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/30 text-lg px-4 py-1 backdrop-blur-md border-primary/50">
            Nossas Realizações
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Excelência em <span className="text-primary">Cada Detalhe</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Explore nossa galeria de projetos entregues. Da concepção à chave na mão, transformamos visões em realidade construída.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.55, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-8 h-10 text-sm font-medium transition-all hover:scale-105 ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 auto-rows-[240px] gap-4"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: 'easeOut' }}
          >
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className={`group relative overflow-hidden rounded-2xl bg-muted shadow-lg transition-all duration-500 hover:shadow-2xl ${getCardClasses(project.id - 1)}`}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.04, ease: 'easeOut' }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                layout
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500"/>
                
                <div className="absolute top-4 left-4">
                  <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}>
                    <Badge variant="secondary" className="mb-3 bg-primary text-primary-foreground border-0 hover:bg-primary/90">
                      {project.category}
                    </Badge>
                  </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {project.location}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    {project.desc}
                  </p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                    whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                  >
                    Ver projeto
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
