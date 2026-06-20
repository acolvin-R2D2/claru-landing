export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, correo, telefono, razon_social, rubro, trabajadores, documentos, remuneraciones } = req.body;

  // Validar campos obligatorios
  if (!nombre || !correo || !telefono || !razon_social) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Construir objeto de datos con los field names exactos de Tally
  const tallyPayload = {
    'Nombre': nombre,
    'Correo': correo,
    'Teléfono': telefono,
    'Razón Social': razon_social,
    'Rubro': rubro || '',
    'Trabajadores': trabajadores || '',
    'Documentos': documentos || '',
    'Remuneraciones': remuneraciones || ''
  };

  // Convertir a URLSearchParams
  const tallyData = new URLSearchParams();
  Object.keys(tallyPayload).forEach(key => {
    tallyData.append(key, tallyPayload[key]);
  });

  try {
    // Enviar a Tally usando el endpoint del formulario
    const response = await fetch('https://tally.so/r/0QAer0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: tallyData.toString(),
      redirect: 'follow'
    });

    console.log('Tally response status:', response.status);

    // Tally redirige después de submit exitoso, así que 200-399 es éxito
    if (response.status >= 200 && response.status < 400) {
      return res.status(200).json({ success: true, message: 'Solicitud enviada a Tally correctamente' });
    } else {
      console.error('Tally error:', response.status);
      return res.status(500).json({ error: 'Error al enviar a Tally: ' + response.status });
    }
  } catch (error) {
    console.error('Tally submit error:', error);
    return res.status(500).json({ error: 'Error interno: ' + error.message });
  }
}
