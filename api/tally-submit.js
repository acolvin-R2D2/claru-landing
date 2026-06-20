export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, correo, telefono, razon_social, rubro, trabajadores, documentos, remuneraciones } = req.body;

  // Validar campos obligatorios
  if (!nombre || !correo || !telefono || !razon_social) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Mapear datos al formato de Tally (field names en Tally)
  const tallyData = new URLSearchParams();
  tallyData.append('Nombre', nombre);
  tallyData.append('Correo', correo);
  tallyData.append('Teléfono', telefono);
  tallyData.append('Razón Social', razon_social);
  tallyData.append('Rubro', rubro || '');
  tallyData.append('Trabajadores', trabajadores || '');
  tallyData.append('Documentos', documentos || '');
  tallyData.append('Remuneraciones', remuneraciones || '');

  try {
    // Enviar a Tally via POST directo
    const response = await fetch('https://tally.so/api/forms/0QAer0/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tallyData.toString(),
    });

    if (!response.ok) {
      console.error('Tally API error:', response.status, await response.text());
      return res.status(response.status).json({ error: 'Error al enviar a Tally' });
    }

    return res.status(200).json({ success: true, message: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Tally submit error:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
}
