'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, CheckSquare, FileText, HardHat, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SSMAPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-32 pb-24">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
          alt="Segurança do Trabalho e Meio Ambiente"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
        <motion.div
          className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-green-600/20 rounded-full mb-4 ring-1 ring-green-500/50 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-100 font-medium text-sm tracking-wide uppercase">Referência em Consultoria</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl">
            Segurança, Saúde <br/>
            <span className="text-green-500">e Meio Ambiente</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Protegendo vidas e garantindo a conformidade legal da sua empresa com soluções técnicas de alto nível.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/ssma/servicos">
              <Button size="lg" className="h-14 px-8 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/50 border-0">
                Ver Nossos Serviços
              </Button>
            </Link>
            <Link href="/ssma/contato">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-green-900 bg-transparent backdrop-blur-sm">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Main Categories with Images */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-20">
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
            { 
              icon: FileText, 
              title: "Laudos e Programas", 
              desc: "PGR, PCMSO, LTCAT, Laudo Ergonômico e mais.",
              image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
            },
            { 
              icon: CheckSquare, 
              title: "Normas e Certificações", 
              desc: "Adequação completa às NRs e certificações ISO.",
              image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            },
            { 
              icon: HardHat, 
              title: "Treinamentos", 
              desc: "NR 10, NR 35, CIPA, Brigada de Incêndio.",
              image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
            },
            { 
              icon: BookOpen, 
              title: "Gestão Ambiental", 
              desc: "Licenciamento e planos de controle ambiental.",
              image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
              whileHover={{ y: -6 }}
            >
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col bg-card">
              <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white flex items-center gap-2">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  <CardTitle className="text-lg sm:text-xl font-bold leading-tight">{item.title}</CardTitle>
                </div>
              </div>
              <CardContent className="pt-4 sm:pt-6 px-5 pb-5 sm:px-6 sm:pb-6 flex-1">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Image Text Split Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
              alt="Engenheiro de segurança em campo"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            className="space-y-5 sm:space-y-6"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Por que a Gestão de SSMA é Vital?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Além de cumprir exigências legais, uma gestão eficiente de <strong className="text-green-600">Segurança, Saúde e Meio Ambiente</strong> protege o maior ativo da sua empresa: as pessoas.
            </p>
            <ul className="space-y-4">
              {[
                "Redução de acidentes e passivos trabalhistas.",
                "Melhoria no clima organizacional e produtividade.",
                "Imagem positiva perante o mercado e clientes.",
                "Conformidade com a legislação vigente (eSocial)."
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-foreground font-medium">{text}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/ssma/servicos">
                <Button variant="link" className="text-green-600 font-bold p-0 text-lg hover:text-green-700">
                  Conheça todas as nossas soluções &rarr;
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
