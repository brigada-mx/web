const projectTypes = [
  { label: 'Administración y operación', value: 'administration' },
  { label: 'Apoyo emocional', value: 'emotional_support' },
  { label: 'Asesoría arquitectónica', value: 'architecture_advice' },
  { label: 'Asesoría legal', value: 'legal_advice' },
  { label: 'Asesoría técnica', value: 'technical_advice' },
  { label: 'Bienes de consumo', value: 'consumer_goods' },
  { label: 'Carreteras y puentes', value: 'roads_bridges' },
  { label: 'Centro de acopio', value: 'collection_center' },
  { label: 'Desarrollo social', value: 'social_development' },
  { label: 'Desarrollo tecnológico', value: 'tech_development' },
  { label: 'Empleo', value: 'jobs' },
  { label: 'Escuelas', value: 'schools' },
  { label: 'Espacio público', value: 'public_spaces' },
  { label: 'Generación de datos', value: 'data_generation' },
  { label: 'Infraestructura hidráulica', value: 'water_infrastructure' },
  { label: 'Instalación deportiva', value: 'sports_installations' },
  { label: 'Medio ambiente', value: 'environment' },
  { label: 'Negocio', value: 'businesses' },
  { label: 'Patrimonio histórico y cultural', value: 'cultural_sites' },
  { label: 'Planeación urbana o rural', value: 'urban_rural_planning' },
  { label: 'Reactivación económica', value: 'local_economy' },
  { label: 'Rendición de cuentas', value: 'accountability' },
  { label: 'Salud', value: 'health' },
  { label: 'Vivienda permanente', value: 'houses' },
  { label: 'Vivienda temporal', value: 'temporary_houses' },
]

const sectors = [
  { value: 'civil', label: 'Civil' },
  { value: 'public', label: 'Público' },
  { value: 'private', label: 'Privado' },
  { value: 'religious', label: 'Religioso' },
]

const projectTypeByValue = projectTypes.reduce((obj, { value, label }) => {
  obj[value] = label // eslint-disable-line no-param-reassign
  return obj
}, {})

const sectorByValue = sectors.reduce((obj, { value, label }) => {
  obj[value] = label // eslint-disable-line no-param-reassign
  return obj
}, {})

export { projectTypes, projectTypeByValue, sectors, sectorByValue }
