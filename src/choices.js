const actionBeneficiariesCriteria = [
  { value: '', label: 'No sabemos' },
  { value: 'convocatoria_abierta', label: 'Convocatoria abierta' },
  { value: 'convocatoria_cerrada', label: 'Convocatoria cerrada (invitación directa a presentar proyectos)' },
  { value: 'mapeo_directo_de_necesidades', label: 'Mapeo directo de necesidades' },
  { value: 'other', label: 'Otro' },
]

const actionBeneficiariesCriteriaByValue = actionBeneficiariesCriteria.reduce((obj, { value, label }) => {
  obj[value] = label // eslint-disable-line no-param-reassign
  return obj
}, {})

const volunteerLocations = [
  { value: 'anywhere', label: 'Desde cualquier lugar' },
  { value: 'in_locality', label: 'En la comunidad afectada' },
  { value: 'other', label: 'Otro(s) lugar(es)' },
]

const volunteerLocationByValue = volunteerLocations.reduce((obj, { value, label }) => {
  obj[value] = label // eslint-disable-line no-param-reassign
  return obj
}, {})

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
  { label: 'Planos arquitectónicos', value: 'architecture_plans' },
  { label: 'Política pública', value: 'public_policy' },
  { label: 'Reactivación económica', value: 'local_economy' },
  { label: 'Rendición de cuentas', value: 'accountability' },
  { label: 'Reparación de vivienda', value: 'house_repair' },
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

const getProjectType = (value) => {
  return projectTypeByValue[value] ||
    value.split('_').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
}

const sectorByValue = sectors.reduce((obj, { value, label }) => {
  obj[value] = label // eslint-disable-line no-param-reassign
  return obj
}, {})

const states = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Coahuila', 'Colima', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Estado de México',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
]

export {
  projectTypes,
  projectTypeByValue,
  getProjectType,
  sectors,
  sectorByValue,
  states,
  volunteerLocationByValue,
  volunteerLocations,
  actionBeneficiariesCriteria,
  actionBeneficiariesCriteriaByValue,
}
