const projectTypes = [
  { value: 'houses', label: 'Vivienda permanente' },
  { value: 'temporary_houses', label: 'Vivienda temporal' },
  { value: 'businesses', label: 'Negocio' },
  { value: 'local_economy', label: 'Reactivación económica' },
  { value: 'social_development', label: 'Desarrollo social' },
  { value: 'jobs', label: 'Empleo' },
  { value: 'consumer_goods', label: 'Bienes de consumo' },
  { value: 'schools', label: 'Escuelas' },
  { value: 'health', label: 'Salud' },
  { value: 'roads_bridges', label: 'Carreteras y puentes' },
  { value: 'water_infrastructure', label: 'Infraestructura hidráulica' },
  { value: 'administration', label: 'Administración y operación' },
  { value: 'public_spaces', label: 'Espacio público' },
  { value: 'sports_installations', label: 'Instalación deportiva' },
  { value: 'cultural_sites', label: 'Patrimonio histórico y cultural' },
  { value: 'environment', label: 'Medio ambiente' },
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
