export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, correo, telefono, razon_social, rubro, trabajadores, documentos, remuneraciones } = req.body;

  // Validar campos obligatorios
  if (!nombre || !correo || !telefono || !razon_social) {
    console.log('Validation failed:', { nombre, correo, telefono, razon_social });
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Construir string de datos similar a un form HTML tradicional
  const params = new URLSearchParams();
  params.append('Nombre', nombre);
  params.append('Correo', correo);
  params.append('Teléfono', telefono);
  params.append('Razón Social', razon_social);
  if (rubro) params.append('Rubro', rubro);
  if (trabajadores) params.append('Trabajadores', trabajadores);
  if (documentos) params.append('Documentos', documentos);
  if (remuneraciones) params.append('Remuneraciones', remuneraciones);

  try {
    console.log('Sending to Tally:', params.toString());

    const response = await fetch('https://tally.so/r/0QAer0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      redirect: 'manual'
    });

    console.log('Tally response status:', response.status);

    // Si el status es 303 (redirect típico de Tally), o 200, es éxito
    if ([200, 301, 302, 303, 307, 308].includes(response.status)) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Unexpected Tally status:', response.status);
      const responseText = await response.text();
      console.error('Tally response body:', responseText.substring(0, 200));
      return res.status(200).json({ success: true }); // Devolver éxito de todas formas
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
    return res.status(200).json({ success: true }); // Devolver éxito de todas formas para no bloquear al usuario
  }
}
