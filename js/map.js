const API_BASE_URL = 'https://719s.mx/api'
let localities = [] // holds all locality features for filtering
let actions = [] // holds all actions for filtering
let filters = { actionSearch: '', locSearch: '', margGrade: '', municipality: '' }
const numList = 250

const apiFetch = (url='', {method='GET', body={}, headers={}, isRelative=true} = {}) => {
  headers['Content-Type'] = 'application/json'

  let request = {
    method: method,
    body: JSON.stringify(body), // `body` must be a string, not an object
    headers: new Headers(headers),
  }

  if (['GET', 'HEAD'].indexOf(method) > -1) { delete request.body }

  if (isRelative) { url = `${API_BASE_URL}${url}` }
  return fetch(url, request)
}

const fetchActions = () => {
  apiFetch('/actions/').then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        actions = data.results
        render()
      })
    }
  }).catch((error) => {
    console.log(error)
    setTimeout(fetchActions, 5000)
  })
}

fetchActions()

mapboxgl.accessToken = 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk',
  zoom: 7.5,
  center: [-95.4042505, 16.6073688],
})

map.scrollZoom.disable()

// creates a popup, but doesn't add it to map yet
const popup = new mapboxgl.Popup({
  closeButton: false,
})

const damageGrade = (feature) => {
  const levels = [
    [10, 'minimal'],
    [50, 'low'],
    [250, 'medium'],
    [1250, 'high'],
    [Number.MAX_SAFE_INTEGER, 'severe'],
  ]
  const { total } = feature.properties
  if (total === undefined || total === null || total === '') {
    return 'unknown'
  }
  for (let l of levels) {
    if (total < l[0]) {
      return l[1]
    }
  }
  return 'unknown'
}

const damageGradeMeta = {
  unknown: {label: 'SIN DATOS', color: '#999'},
  minimal: {label: 'MÍNIMO', color: '#ff0'},
  low: {label: 'MENOR', color: '#db0'},
  medium: {label: 'MEDIO', color: '#d80'},
  high: {label: 'GRAVE', color: '#d40'},
  severe: {label: 'MUY GRAVE', color: '#f00'},
}

const actionFilter = $('#action-filter')
const filter = $('#feature-filter')
const list = $('#feature-list')
const margFilter = $('.marginalization-filter')
const muniFilter = $('.municipality-filter')
margFilter.on('change', () => {
  const option = margFilter.find('option:selected')
  filters.margGrade = option.val()
  render()
})
muniFilter.on('change', () => {
  const option = muniFilter.find('option:selected')
  filters.municipality = option.val().substring(0, 5)
  render()
})

const fmt = num => {
  return num.toLocaleString()
}

const showPopup = (feature) => {
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML(renderPopup(feature))
    .addTo(map)
}

const renderPopup = (locality) => {
  const { stateName, locName, habit, notHabit, destroyed, margGrade } = locality.properties
  const total = habit + notHabit + destroyed
  return `
    <span class="popup-header">${locName}, ${stateName}</span>
    <div class="popup-item"><span class="popup-label">VIVIENDAS DAÑADAS</span> <span class="popup-value">${fmt(total)}</span></div>
    <div class="popup-item"><span class="popup-label">HABITABLES</span> <span class="popup-value">${fmt(habit)}</span></div>
    <div class="popup-item"><span class="popup-label">NO HABITABLES</span> <span class="popup-value">${fmt(notHabit)}</span></div>
    <div class="popup-item"><span class="popup-label">PÉRDIDA TOTAL</span> <span class="popup-value">${fmt(destroyed)}</span></div>
    <div class="popup-item"><span class="popup-label">GRADO MARGINACIÓN</span> <span class="popup-value">${margGrade}</span></div>
  `
}

const renderLegend = (localities) => {
  const legend = $('.legend-items-container')
  const counts = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    minimal: 0,
    unknown: 0,
  }

  for (let l of localities) {
    counts[l.properties.dmgGrade] += 1
  }
  const items = Object.keys(counts).map(key => {
    const { label, color } = damageGradeMeta[key]
    return `<div class='legend-item'>
      <div class="circle" style="background-color: ${color}"></div>
      <span class="label">${label}</span>
      <span class="count">${fmt(counts[key])}</span>
    </div>`
  })
  legend.html(items.join('\n'))
}

const renderList = (localities) => {
  // clear any existing listings
  list.html('')
  for (let l of localities) {
    const item = renderListItem(l)
    item.hover(
      () => {
        showPopup(l)
      },
      () => {
        popup.remove()
      }
    )
    list.append(item)
    item.on('click', () => {
      map.setCenter(l.geometry.coordinates)
    })
  }
}

const renderListItem = (locality) => {
  const { locName, stateName, margGrade, total = '?', dmgGrade } = locality.properties
  const item = $(`<div class="list-item dmg-${dmgGrade}">`)

  const header = $('<div class="list-item-header">')
  header.text(`${locName}, ${stateName}`)

  const metrics = $('<div class="list-item-metrics">')
  metrics.html(`
    <div><span class="label">MARG. SOCIAL</span> <span class="value">${margGrade || '?'}</span></div>
    <div><span class="label">VIVIENDAS DAÑADAS</span> <span class="value">${fmt(total)}</span></div>
  `)

  item.append(header)
  item.append(metrics)
  return item
}

const renderActions = (actions) => {
  $('.header-actions-title').text(`${actions.length} acciones de reconstrucción`)
  const fields = [
    {value: 'Estado', class: ''},
    {value: 'Municipio', class: 'medium'},
    {value: 'Localidad', class: 'medium'},
    {value: 'Organización responsable', class: ''},
    {value: 'Sector', class: ''},
    {value: 'Acción', class: 'medium'},
    {value: 'Descripción', class: 'wide'},
    {value: 'Unidad de medida', class: ''},
    {value: 'Meta', class: ''},
    {value: 'Presupuesto $MXN', class: ''},
    {value: 'Presupuesto ejercido $MXN', class: ''},
    {value: 'Fecha de inicio', class: ''},
    {value: 'Fecha final', class: ''},
    {value: 'Estatus', class: ''},
    {value: 'Persona responsable', class: 'medium'},
    {value: 'Correo electrónico', class: ''},
    {value: 'Teléfono', class: ''},
  ]
  const cleanValue = (v) => {
    if (v === null || v === undefined || v === '') {
      return '-'
    }
    return v
  }
  const toCurrency = (amt) => {
    if (!amt) return amt
    return new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'USD' }).format(amt)
  }

  const headRow = `<tr>${fields.map(f => `<th class='${f.class}'>${f.value}</th>`).join('\n')}</tr>`
  const rows = actions.map(a => {
    const values = [
      {value: a.locality.state_name, class: ''},
      {value: a.locality.municipality_name, class: 'medium'},
      {value: a.locality.name, class: 'medium'},
      {value: a.organization.name || a.sub_organization, class: ''},
      {value: a.action_type, class: ''},
      {value: a.desc, class: 'medium'},
      {value: a.long_desc, class: 'wide'},
      {value: a.unit_of_measurement, class: ''},
      {value: a.target, class: ''},
      {value: toCurrency(a.budget), class: ''},
      {value: toCurrency(a.spent), class: ''},
      {value: a.start_date, class: ''},
      {value: a.end_date, class: ''},
      {value: a.status_name, class: ''},
      {value: a.contact.person_responsible, class: 'medium'},
      {value: a.contact.email, class: ''},
      {value: a.contact.phone, class: ''},
    ]
    return `<tr>${values.map(v => `<td class='${v.class}'>${cleanValue(v.value)}</td>`).join('\n')}</tr>`
  })
  const table = `<table id='actions-table'>${headRow}${rows.join('\n')}</table>`
  $('.actions-table-container').html(table)
}

const cleanAccentedChars = (s) => {
  s = s.replace(/[áÁ]/g, 'a')
  s = s.replace(/[éÉ]/g, 'e')
  s = s.replace(/[íÍ]/g, 'i')
  s = s.replace(/[ñÑ]/g, 'n')
  s = s.replace(/[óÓ]/g, 'o')
  s = s.replace(/[úÚüÜ]/g, 'u')
  return s
}

// splits text into whitespace delimited lowercase words
const toLowerWords = (text) => (text || '')
  .toLowerCase()
  .replace(/[^\s0-9a-z]/gi, '')
  .split(/\s+/g)
  .filter(x => x.length > 0)

const tokenMatch = (h, n) => {
  const needles = toLowerWords(cleanAccentedChars(n))
  const haystack = toLowerWords(cleanAccentedChars(h))

  outer:
  for (let n of needles) {
    for (let i = 0, l = haystack.length; i < l; i++) {
      if (haystack[i].indexOf(n) >= 0) {
        haystack.splice(i, 1)
        continue outer
      }
    }
    return false
  }
  return true
}

const deduplicate = (features, comparatorProperty) => {
  const existingFeatureKeys = {}
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  const uniqueFeatures = features.filter((el) => {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true
      return true
    }
  })

  return uniqueFeatures
}

/**
 * Comparator for localities `a` and `b`, which assigns greater priority to
   localities with high "marginación social" and many damaged buildings.
 */
const compareLocalities = (a, b) => {
  const { total: ta } = a.properties
  const { total: tb } = b.properties
  if (isNaN(parseFloat(ta))) return 1
  if (isNaN(parseFloat(tb))) return -1
  return parseFloat(tb) - parseFloat(ta)
}

const renderMuniFilter = () => {
  // returns markup for dropdown options (municipalities)
  const items = []
  const s = new Set()
  for (let l of localities) {
    const { cvegeoS, munName, stateName } = l.properties
    const _cvegeoS = cvegeoS.substring(0, 5)
    if (!s.has(_cvegeoS)) {
      s.add(_cvegeoS)
      items.push({ cvegeoS: _cvegeoS, munName, stateName })
    }
  }

  const content = items.sort((a, b) => {
    if(a.munName < b.munName) return -1
    if(a.munName > b.munName) return 1
    return 0
  }).map(o => {
    const { cvegeoS, munName, stateName } = o
    return `<option value="${cvegeoS}">${munName}, ${stateName}</option>`
  })
  content.unshift('<option value="" selected="selected">Municipio</option>')
  return content.join('\n')
}

map.on('load', () => {
  map.addLayer({
    id: 'damage',
    type: 'circle',
    source: {
      type: 'vector',
      url: 'mapbox://kylebebak.8ysz50ul',
    },
    'source-layer': 'oaxaca-26oct-6wh485',
    paint: {
      'circle-radius': {
        property: 'total',
        type: 'exponential',
        stops: [
          [1, 5],
          [15000, 35],
        ],
      },
      'circle-color': {
        property: 'total',
        stops: [
          [0, '#ff0'],
          [10, '#db0'],
          [50, '#d80'],
          [250, '#d40'],
          [1250, '#f00'],
        ],
      },
      'circle-opacity': 0.75,
    },
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-left')

  map.on('mousemove', 'damage', (e) => {
    // change the cursor style as a ui indicator
    map.getCanvas().style.cursor = 'pointer'

    // populate the popup and set its coordinates based on the feature
    const feature = e.features[0]
    showPopup(feature)
  })

  map.on('mouseleave', 'damage', () => {
    map.getCanvas().style.cursor = ''
    popup.remove()
  })

  filter.on('keyup', (e) => {
    // filter visible features that don't match the input value
    filters.locSearch = e.target.value
    render(true, false)
  })

  actionFilter.on('keyup', (e) => {
    filters.actionSearch = e.target.value
    render(false, true)
  })

  map.on('data', (data) => {
    if (localities.length > 0) { return } // only call this function on initialization

    if (data.dataType === 'source' && data.isSourceLoaded) {
      const features = map.querySourceFeatures('damage', {sourceLayer: 'oaxaca-26oct-6wh485'})
      localities = deduplicate(features, 'cvegeo')
      localities.sort(compareLocalities)
      for (let l of localities) {
        const dmgGrade = damageGrade(l)
        l.properties.dmgGrade = dmgGrade
        l.properties.cvegeoS = l.properties.cvegeo.toString()
      }
      muniFilter.html(renderMuniFilter())
      render()
    }
  })
})

/*
 * Renders list items, legend and features layer every time filter state changes.
 */
const render = (includeLocalities=true, includeActions=true) => {
  const { locSearch, actionSearch, margGrade: marg, municipality: muni } = filters

  if (includeLocalities) {
    const filtered = localities.filter((l) => {
      const { locName, stateName, margGrade, cvegeoS } = l.properties
      const matchesSearch = tokenMatch(`${locName} ${stateName}`, locSearch)
      const matchestMarg = !marg || marg === margGrade.replace(/ /g, '_').toLowerCase()
      const matchesMuni = !muni || muni === cvegeoS.substring(0, 5)
      return matchesSearch && matchestMarg && matchesMuni
    })

    // populate the sidebar with filtered results
    renderList(filtered.slice(0, numList))

    renderLegend(filtered)

    // set the filter to populate features into the layer
    map.setFilter('damage', ['in', 'cvegeo'].concat(
      filtered.map((l) => {
        return l.properties.cvegeo
      })
    ))
  }

  if (includeActions) {
    const filteredActions = actions.filter((a) => {
      const { organization, sub_organization, action, locality } = a
      const { name: locName, municipality_name, state_name, cvegeo } = locality
      const matchesSearch = tokenMatch(
        `${sub_organization} ${action} ${locName} ${municipality_name}
        ${state_name} ${organization.name}`, actionSearch)
      const matchesMuni = !muni || muni === cvegeo.substring(0, 5)
      return matchesSearch && matchesMuni
    })

    renderActions(filteredActions)
  }
}
