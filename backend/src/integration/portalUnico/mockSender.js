export async function sendMock(xml) {
  await new Promise(r => setTimeout(r, 1000));
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return {
    protocolo: `PU${year}${seq}`,
    status: 'RECEBIDO',
    mensagem: 'Documento recebido com sucesso',
    data_envio: new Date()
  };
}
