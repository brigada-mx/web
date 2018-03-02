const projectTypes = [
  { value: 'houses', label: 'Vivienda' },
  { value: 'roads_bridges', label: 'Carreteras y puentes' },
  { value: 'schools', label: 'Escuelas' },
  { value: 'consumer_goods', label: 'Bienes de consumo' },
  { value: 'clothes', label: 'Ropa' },
  { value: 'health', label: 'Salud' },
  { value: 'water_infrastructure', label: 'Infraestructura hidráulica' },
  { value: 'administration', label: 'Administración y operación' },
  { value: 'social_development', label: 'Desarrollo social' },
  { value: 'public_spaces', label: 'Espacio público' },
  { value: 'sports_installations', label: 'Instalaciones deportivas' },
  { value: 'cultural_sites', label: 'Patrimonio histórico y cultural' },
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
