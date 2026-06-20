export default async function handler(req, res) {
  // Endpoint de prueba para debuggear Tally submission

  const testData = new URLSearchParams();
  testData.append('Nombre', 'Test User');
  testData.append('Correo', 'test@example.com');
  testData.append('Teléfono', '+56912345678');
  testData.append('Razón Social', 'Test Company');
  testData.append('Rubro', 'Consultora');
  testData.append('Trabajadores', '1 a 3');
  testData.append('Documentos', '20 a 100');
  testData.append('Remuneraciones', 'No');

  try {
    console.log('TEST: Enviando datos dummy a Tally...');
    console.log('TEST: Data string:', testData.toString());

    const response = await fetch('https://tally.so/r/0QAer0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: testData.toString(),
      redirect: 'manual'
    });

    console.log('TEST: Response status:', response.status);
    console.log('TEST: Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    const responseBody = await response.text();
    console.log('TEST: Response body (first 500 chars):', responseBody.substring(0, 500));

    return res.status(200).json({
      success: true,
      test: 'completed',
      tallyStatus: response.status,
      tallyHeaders: Object.fromEntries(response.headers),
      tallyBodyPreview: responseBody.substring(0, 300)
    });
  } catch (error) {
    console.error('TEST: Error:', error.message);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
