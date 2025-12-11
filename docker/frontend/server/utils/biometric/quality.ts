export const validateBiometricQuality = (type: string, data: any, score: number) => {
  // Simulación: Si hay datos, asumimos que la calidad es aceptable
  // En producción, analizaríamos la imagen
  const hasData = data && Object.keys(data).length > 0;
  
  return {
    passed: hasData && (score === undefined || score > 40),
    score: score || 85,
    reason: !hasData ? 'Sin datos biométricos' : null
  };
};