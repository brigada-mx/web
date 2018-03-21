import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import Styles from './EstablishmentPopup.css'


const EstablishmentPopup = ({ establishment }) => {
  if (!establishment) return null

  const {
    nom_estab: name,
    telefono: phone,
    nom_v_e_1: street,
    numero_ext: number,
    tipo_asent: areaType,
    nomb_asent: area,
    cod_postal: postalCode,
    municipio: muni,
    location: { lat, lng },
  } = establishment

  return (
    <Popup offset={10} coordinates={[lng, lat]}>
      <div className={Styles.container}>
        <p className={Styles.header}>{name}</p>
        <p className={Styles.address}>{street} {number === '0' ? '' : number}</p>
        <p className={Styles.address}>{areaType} {area}</p>
        <p className={Styles.address}>{postalCode} {muni}</p>
        <p className={Styles.contact}>{phone}</p>
      </div>
    </Popup>
  )
}

EstablishmentPopup.propTypes = {
  establishment: PropTypes.object.isRequired,
}

export default EstablishmentPopup
