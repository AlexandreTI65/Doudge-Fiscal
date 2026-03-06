'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NormasPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2069&auto=format&fit=crop"
            alt="Normas e Documentação"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <motion.div
          className="relative z-10 text-center space-y-4 px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Normas e Certificações</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Garantimos que sua empresa opere dentro dos mais rigorosos padrões nacionais e internacionais.
          </p>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <Card className="border-t-4 border-t-green-600 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-700">Normas Regulamentadoras (NR)</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {[
                "NR-01 - Gerenciamento de Riscos Ocupacionais",
                "NR-05 - CIPA",
                "NR-06 - Equipamentos de Proteção Individual",
                "NR-07 - PCMSO",
                "NR-09 - Avaliação de Exposições Ocupacionais",
                "NR-10 - Segurança em Eletricidade",
                "NR-12 - Segurança em Máquinas",
                "NR-18 - Condições na Indústria da Construção",
                "NR-33 - Espaços Confinados",
                "NR-35 - Trabalho em Altura"
              ].map((nr, i) => (
                <motion.li key={i} className="flex gap-3 items-start text-muted-foreground hover:text-foreground transition-colors" initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }} viewport={{ once: true }}>
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> 
                  <span>{nr}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <Card className="border-t-4 border-t-green-600 shadow-xl h-fit">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-700">Certificações ISO</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-6">
              <li className="flex gap-4 items-start text-muted-foreground">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg shrink-0 text-green-700 font-bold text-lg">45001</div>
                <div>
                  <strong className="block text-foreground mb-1">ISO 45001</strong> 
                  Sistema de Gestão de Saúde e Segurança Ocupacional. Foco na redução de acidentes e doenças ocupacionais.
                </div>
              </li>
              <li className="flex gap-4 items-start text-muted-foreground">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg shrink-0 text-green-700 font-bold text-lg">14001</div>
                <div>
                  <strong className="block text-foreground mb-1">ISO 14001</strong>
                  Sistema de Gestão Ambiental. Compromisso com a sustentabilidade e conformidade legal ambiental.
                </div>
              </li>
              <li className="flex gap-4 items-start text-muted-foreground">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg shrink-0 text-green-700 font-bold border-2 border-green-600/20">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-foreground mb-1">Auditorias de Conformidade</strong>
                   Diagnóstico completo e preparação para certificações, identificando gaps e planos de ação.
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
