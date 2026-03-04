import { generatePortalXML } from './xmlGenerator.js';
import { sendMock } from './mockSender.js';
import { parseResponse } from './responseParser.js';
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function sendToPortal(product, classification) {
  const xml = generatePortalXML(product, classification);
  let response;
  if (process.env.INTEGRATION_MODE === 'mock') {
    response = await sendMock(xml);
  } else {
    // Estrutura para futura integração real
    throw new Error('Integração real não implementada');
  }
  parseResponse(response);
  const result = await pool.query(
    `INSERT INTO integrations (product_id, portal_payload, status, protocolo, response_json, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [product.id, xml, response.status, response.protocolo, response]
  );
  return {
    protocolo: response.protocolo,
    status: response.status,
    mensagem: response.mensagem
  };
}
