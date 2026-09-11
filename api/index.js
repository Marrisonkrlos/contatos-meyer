import { createClient } from '@supabase/supabase-js';

// Conecta ao Supabase usando as variáveis salvas na Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configuração do CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Buscar cadastros
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('contatos').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST: Salvar novo cadastro
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { data, error } = await supabase.from('contatos').insert([body]);
      if (error) throw error;
      return res.status(200).json(data);
    }

    // PUT: Atualizar cadastro existente
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, ...updateData } = body;
      const { data, error } = await supabase.from('contatos').update(updateData).eq('id', id);
      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE: Excluir cadastro
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { error } = await supabase.from('contatos').delete().eq('id', body.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
