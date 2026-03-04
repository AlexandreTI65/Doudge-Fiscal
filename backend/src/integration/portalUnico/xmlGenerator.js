import { create } from 'xmlbuilder2';

export function generatePortalXML(product, classification) {
  const doc = create({
    Produto: {
      Descricao: product.descricao,
      Marca: product.marca,
      Modelo: product.modelo,
      PaisOrigem: product.pais_origem,
      NCM: classification.code
    }
  });
  return doc.end({ prettyPrint: true });
}
