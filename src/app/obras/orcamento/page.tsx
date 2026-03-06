'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Upload, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function OrcamentoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
          alt="Solicitar Orçamento"
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
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Solicite seu Orçamento</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Conte com nossa equipe para planejar e executar sua obra.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-4 max-w-3xl -mt-16 relative z-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="border-t-4 border-t-primary shadow-2xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Detalhes do Projeto</CardTitle>
            <CardDescription className="text-base">
              Preencha o formulário abaixo para receber uma proposta personalizada em até 24 horas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/20"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <div className="w-8 h-8 text-primary font-bold text-3xl">✓</div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Solicitação Enviada!</h3>
                <p className="text-muted-foreground text-lg mb-6">Nossa equipe comercial entrará em contato em breve.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Enviar nova solicitação</Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                 <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input required placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Empresa (Opcional)</label>
                    <Input placeholder="Nome da empresa" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" required placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone / WhatsApp</label>
                    <Input type="tel" required placeholder="(11) 99999-9999" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Projeto</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Reforma Residencial</option>
                    <option>Reforma Comercial</option>
                    <option>Construção do Zero</option>
                    <option>Projeto Arquitetônico</option>
                    <option>Manutenção Predial</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição do Projeto</label>
                  <Textarea placeholder="Descreva o que você precisa... (Ex: Reforma de cozinha e sala, 50m², preciso começar mês que vem)" className="min-h-[120px]" />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium">Anexo de Planta ou Referência (Opcional)</label>
                   <div className="border border-dashed border-input rounded-md p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8 opacity-50"/>
                      <span className="text-sm">Clique para selecionar arquivos</span>
                   </div>
                </div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform">
                  Enviar Solicitação
                </Button>
                </motion.div>
              </motion.form>
            )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <section className="container mx-auto px-4 max-w-3xl">
        <Card className="border shadow-xl bg-card overflow-hidden">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
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
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/5">
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
