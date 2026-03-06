'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Truck, Users, Activity, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function SSMAContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop"
          alt="Contato SSMA"
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
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Fale com um Especialista SSMA</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Sua segurança é nossa prioridade. Entre em contato para uma consultoria personalizada.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Info & Features */}
        <motion.div
          className="space-y-8 sticky top-24 self-start"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Por que nos <span className="text-green-600">escolher?</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Garanta a conformidade da sua empresa, evite multas e proteja a segurança dos seus colaboradores com nossa consultoria especializada.
            </p>
          </div>

          <div className="space-y-6">
            <motion.div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">PGR e PCMSO</h3>
                <p className="text-sm text-muted-foreground">Elaboração técnica rigorosa dos programas obrigatórios.</p>
              </div>
            </motion.div>
            <motion.div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Treinamentos In-Company</h3>
                <p className="text-sm text-muted-foreground">Capacitação prática da equipe conforme NRs vigentes.</p>
              </div>
            </motion.div>
            <motion.div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Atendimento Nacional</h3>
                <p className="text-sm text-muted-foreground">Logística e suporte técnico em todo território brasileiro.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
        <Card className="border-t-4 border-t-green-600 shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Solicite uma Proposta</CardTitle>
            <CardDescription>Preencha os dados abaixo. Entraremos em contato em breve.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="text-center py-12 text-green-600 font-medium bg-green-50 rounded-lg border border-green-200"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-xl font-bold mb-2">Mensagem Enviada!</h3>
                <p className="text-green-700">Obrigado pelo interesse.</p>
                <Button variant="outline" className="mt-6 border-green-600 text-green-600 hover:bg-green-50" onClick={() => setSubmitted(false)}>Enviar nova mensagem</Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <Input required placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Empresa</label>
                  <Input required placeholder="Nome da empresa" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Corporativo</label>
                  <Input type="email" required placeholder="email@empresa.com.br" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input type="tel" required placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mensagem ou Necessidade</label>
                  <Textarea required placeholder="Descreva sua necessidade (Ex: Preciso de PGR para obra...)" className="min-h-[100px]" />
                </div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-lg shadow-green-600/20 transition-all hover:shadow-green-600/40">
                  Enviar Solicitação
                </Button>
                </motion.div>
              </motion.form>
            )}
            </AnimatePresence>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      <section className="container mx-auto px-4 max-w-6xl">
        <Card className="border shadow-xl bg-card overflow-hidden">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Endereço
            </CardTitle>
            <CardDescription>
              Rua Altino Arantes, São Paulo - SP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-[340px] rounded-2xl overflow-hidden border bg-muted/30">
              <iframe
                title="Localização no Google Maps"
                src="https://maps.google.com/maps?q=Rua+Altino+Arantes,+S%C3%A3o+Paulo,+SP&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className="w-fit">
              <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Altino+Arantes,+S%C3%A3o+Paulo,+SP"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no Google Maps <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
