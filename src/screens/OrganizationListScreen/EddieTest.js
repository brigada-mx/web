import React from 'react'

import OrganizationListItem from 'components/OrganizationListItem'
import Styles from './TestScreen.css'


const TestScreen = () => {
  const props = {
    organization: {
      name: 'Reconstruyendo Comunidades Integrales',
      tag1: 'Civil',
      tag2: 'Vivienda',
      tag3: 'Planeación urbana',
      mission: 'Buscamos impulsar la solidaridad en los voluntarios, mediante proyectos de construcción enfocados a elevar la calidad de vida de las familias mexicanas más…',
      investment: 72000,
      projects: 11,
      photos: 72,
    },
  }

  return (
    <div className={Styles.temporary}>
      <div className="wrapper-lg wrapper-md">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-8 col-xs-4">
            <div className={Styles.orgsContainer}>
              <OrganizationListItem {...props} />
              <OrganizationListItem {...props} />
              <OrganizationListItem {...props} />
              <OrganizationListItem {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestScreen
