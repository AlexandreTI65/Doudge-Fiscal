import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/50 text-foreground border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">
              PREMIUM<span className="text-primary">CORP</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Soluções completas em Obras, Reformas e Consultoria em Segurança e Saúde do Trabalho. Excelência e compromisso em cada detalhe.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Obras */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Obras e Reformas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/obras/servicos" className="hover:text-primary">Serviços</Link></li>
              <li><Link href="/obras/portfolio" className="hover:text-primary">Portfólio</Link></li>
              <li><Link href="/obras/antes-e-depois" className="hover:text-primary">Antes e Depois</Link></li>
              <li><Link href="/obras/orcamento" className="hover:text-primary">Solicitar Orçamento</Link></li>
            </ul>
          </div>

          {/* Links SSMA */}
          <div>
            <h4 className="font-semibold text-lg mb-4">SSMA</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ssma/servicos" className="hover:text-primary">Consultoria</Link></li>
              <li><Link href="/ssma/normas-e-certificacoes" className="hover:text-primary">Normas e Certificações</Link></li>
              <li><Link href="/ssma/treinamentos" className="hover:text-primary">Treinamentos</Link></li>
              <li><Link href="/ssma/contato" className="hover:text-primary">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contato@premiumcorp.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PremiumCorp. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
