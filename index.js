import { createClient } from '@supabase/supabase-js';

// Tenta pegar a chave pública ou a chave secreta cadastrada na Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configuração completa de CORS
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

  // Nome da tabela no Supabase (mude se no seu banco estiver diferente)
  const NOME_TABELA = 'contatos';

  try {
    // GET: Buscar contatos
    if (req.method === 'GET') {
      const { data, error } = await supabase.from(NOME_TABELA).select('*');
      if (error) {
        console.error("Erro no Supabase GET:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json(data || []);
    }

    // POST: Salvar novo registro
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { data, error } = await supabase.from(NOME_TABELA).insert([body]);
      if (error) {
        console.error("Erro no Supabase POST:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json(data);
    }

    // PUT: Editar registro
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, ...updateData } = body;
      const { data, error } = await supabase.from(NOME_TABELA).update(updateData).eq('id', id);
      if (error) {
        console.error("Erro no Supabase PUT:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json(data);
    }

    // DELETE: Excluir registro
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { error } = await supabase.from(NOME_TABELA).delete().eq('id', body.id);
      if (error) {
        console.error("Erro no Supabase DELETE:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error("Erro geral no Servidor:", error);
    return res.status(500).json({ error: error.message });
  }
}