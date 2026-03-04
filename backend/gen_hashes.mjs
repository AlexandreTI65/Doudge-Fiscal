import bcrypt from 'bcrypt';

const run = async () => {
  const adminHash = await bcrypt.hash('admin', 10);
  const analistaHash = await bcrypt.hash('analista', 10);
  console.log('admin:', adminHash);
  console.log('analista:', analistaHash);
};

run();
