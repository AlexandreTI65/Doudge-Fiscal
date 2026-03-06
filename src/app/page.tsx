'use client';
import { Hero } from '@/components/sections/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, HardHat, Shield, Star, Users, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, useReducedMotion } from 'framer-motion';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const sectionStagger = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.6, ease: 'easeOut' as const, staggerChildren: prefersReducedMotion ? 0 : 0.1 },
    },
  };

  const sectionItem = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0.01 : 0.45, ease: 'easeOut' as const } },
  };

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.6, ease: 'easeOut' as const },
    viewport: { once: true, amount: 0.2 as const },
  };

  return (
    <div className="flex flex-col">
      <Hero />

      {/* Segments Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16 space-y-4" {...fadeUp}>
             <Badge className="bg-primary/10 text-primary border-0 rounded-full text-base px-6">Áreas de Atuação</Badge>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Excelência em Duas Frentes</h2>
             <p className="max-w-2xl mx-auto text-xl text-muted-foreground">Unificamos o conhecimento da engenharia civil com as normas de segurança para entregar resultados superiores.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Card Obras */}
            <motion.div
              variants={sectionItem}
              whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
            <Link href="/obras" className="group">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <Image 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Obras e Reformas" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.6] group-hover:brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6">
                    <HardHat className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">Obras e Reformas</h3>
                  <p className="text-lg text-gray-200 mb-8 max-w-md font-light">
                    Execução de projetos residenciais e comerciais com alto padrão de acabamento e gestão eficiente.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Reformas completas</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Manutenção predial</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Projetos Turnkey</li>
                  </ul>
                  <Button variant="secondary" className="font-bold rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Ver Projetos
                  </Button>
                </div>
              </div>
            </Link>
            </motion.div>

            {/* Card SSMA */}
            <motion.div
              variants={sectionItem}
              whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
            <Link href="/ssma" className="group">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500/50">
                <Image 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                  alt="Consultoria SSMA" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.6] group-hover:brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                   <div className="w-16 h-16 rounded-2xl bg-green-500/20 backdrop-blur-md flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">Consultoria SSMA</h3>
                  <p className="text-lg text-gray-200 mb-8 max-w-md font-light">
                    Segurança, Saúde e Meio Ambiente. Conformidade legal e tranquilidade para sua empresa operar.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-green-400" /> PGR, PCMSO, LTCAT</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-green-400" /> Treinamentos NRs</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-green-400" /> Gestão Ambiental</li>
                  </ul>
                  <Button variant="secondary" className="font-bold rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    Ver Soluções SSMA
                  </Button>
                </div>
              </div>
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section - Updated with visual stats */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
             alt="Background Office" 
             fill 
             className="object-cover brightness-[0.05]"
           />
        </div>
        <motion.div className="container mx-auto px-4 relative z-10 text-center" {...fadeUp}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 text-foreground text-white">Por que somos referência?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              viewport={{ once: true }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">+15</h3>
              <p className="text-gray-300 font-medium text-base sm:text-lg leading-tight">Anos de Mercado</p>
            </motion.div>
            <motion.div
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">+500</h3>
              <p className="text-gray-300 font-medium text-base sm:text-lg leading-tight">Projetos Entregues</p>
            </motion.div>
            <motion.div
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              viewport={{ once: true }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">100%</h3>
              <p className="text-gray-300 font-medium text-base sm:text-lg leading-tight">Satisfação</p>
            </motion.div>
            <motion.div
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">ISO</h3>
              <p className="text-gray-300 font-medium text-base sm:text-lg leading-tight">Certificações</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 bg-background">
        <motion.div className="container mx-auto px-4 text-center" {...fadeUp}>
           <h2 className="text-3xl font-bold mb-12">O que dizem nossos clientes</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Carlos Mendes", role: "Diretor Industrial", text: "A consultoria SSMA elevou nosso padrão de segurança a outro nível. Profissionalismo ímpar.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" },
                { name: "Ana Souza", role: "Arquiteta", text: "Parceiros confiáveis para execução de obras. O acabamento é sempre impecável e dentro do prazo.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" },
                { name: "Roberto Silva", role: "Síndico Profissional", text: "A manutenção predial preventiva reduziu nossos custos em 30%. Recomendo fortemente.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" }
              ].map((client, i) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                >
                <Card className="border-0 shadow-lg bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="pt-8 space-y-4">
                     <div className="flex justify-center gap-1 text-yellow-500">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current"/>)}
                     </div>
                     <p className="text-muted-foreground italic">&quot;{client.text}&quot;</p>
                     <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                           <Image src={client.img} alt={client.name} fill className="object-cover"/>
                        </div>
                        <div className="text-left">
                           <h4 className="font-bold text-foreground">{client.name}</h4>
                           <p className="text-xs text-muted-foreground">{client.role}</p>
                        </div>
                     </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center pb-24">
        <motion.div
          className="rounded-[3rem] p-12 md:p-24 relative overflow-hidden group cursor-pointer shadow-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="absolute -inset-24 bg-primary/20 blur-3xl"
            animate={prefersReducedMotion ? { opacity: 0.2, scale: 1 } : { opacity: [0.2, 0.45, 0.2], scale: [1, 1.04, 1] }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0">
             <Image 
               src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop" 
               alt="CTA Background" 
               fill 
               className="object-cover brightness-[0.3] group-hover:scale-105 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Pronto para elevar o nível do seu projeto?</h2>
            <p className="text-xl md:text-2xl text-gray-200">
              Seja para construir seu sonho ou garantir a segurança da sua equipe, nós temos a solução ideal.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/obras/orcamento">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, delay: prefersReducedMotion ? 0 : 0.05 }}
                  viewport={{ once: true }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-full w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl shadow-primary/20">
                    Cotar Obra ou Reforma
                  </Button>
                </motion.div>
              </Link>
              <Link href="/ssma/contato">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, delay: prefersReducedMotion ? 0 : 0.12 }}
                  viewport={{ once: true }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-full w-full sm:w-auto bg-white/15 border-white/70 text-white hover:bg-white/25 hover:text-white backdrop-blur-md shadow-xl shadow-black/30">
                     Falar com Especialista
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
