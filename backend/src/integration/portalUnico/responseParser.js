export function parseResponse(response) {
  const required = ['protocolo', 'status', 'mensagem', 'data_envio'];
  for (const key of required) {
    if (!response[key]) throw new Error(`Campo obrigatório ausente: ${key}`);
  }
  return response;
}
