import React, { useState, useCallback, useRef, useEffect } from 'react'
import { getAllReports } from './client'
import { errorNotification } from './Notification'
import { v4 as uuidv4 } from 'uuid'
import ReportDrawerForm from './ReportDrawerForm'
import moment from 'moment'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { libraries, mapContainerStyle, options, center } from './mapStyles.js'
import './App.css'

function App() {
  const [reportsData, setReportsData] = useState([])
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [reports, setReports] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [markerMap, setMarkerMap] = useState({})

  const fetchReports = () => {
    getAllReports()
      .then((res) => res.json())
      .then((data) => {
        console.log('fetch complete')
        console.log(data)
        setReportsData(data)
        parseGet(data)
      })
      .catch((err) => {
        console.log(err.response)
        err.response.json().then((res) => {
          console.log(res)
          errorNotification(
            'There was an issue',
            `${res.message} [${res.status}] [${res.error}]`
          )
        })
      })
  }

  const parseGet = (reportsData) => {
    for (let i = 0; i < reportsData.length; i++) {
      setReports((current) => [
        ...current,
        {
          id: reportsData[i].id,
          name: reportsData[i].name,
          email: reportsData[i].email,
          address: reportsData[i].address,
          lat: reportsData[i].lat,
          lng: reportsData[i].lng,
          comment: reportsData[i].comment,
          score: reportsData[i].score,
          bug: reportsData[i].bug,
          date: new Date(
            reportsData[i].year,
            reportsData[i].month,
            reportsData[i].day
          )
        }
      ])
    }
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const mapRef = useRef()

  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
  }, [])

  const markerLoadHandler = (m, marker) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [marker.lat - marker.lng]: m }
    })
  }

  const markerClickHandler = (event, marker) => {
    if (mapRef.current.zoom < 14) {
      mapRef.current.setZoom(14)
      panTo({ lat: marker.lat, lng: marker.lng })
    }

    if (selected) {
      setSelected(false)
    }
    setSelectedPlace(marker)
    setSelected(true)
  }

  useEffect(() => {
    console.log('start fetch')
    fetchReports()
  }, [])

  useEffect(() => {
    if (reports.length === reportsData.length && reports.length) {
      setMarkers((current) => [...reports])
    }
  }, [reports, reports.length, reportsData.length])

  if (loadError) return 'Error'
  if (!isLoaded) return 'Loading'

  return (
    <div>
      <ReportDrawerForm
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        fetchReports={fetchReports}
      />
      <button className="btn" onClick={() => setShowDrawer(!showDrawer)}>
        Report Pest
      </button>
      <img
        src={'/logo.png'}
        alt="Logo"
        style={{
          zIndex: '10',
          width: '300px',
          position: 'absolute',
          left: '0.5rem',
          top: '0.5rem'
        }}
      />
      <Search panTo={panTo} />
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onLoad={(m) => markerLoadHandler(m, marker)}
            onClick={(event) => markerClickHandler(event, marker)}
            icon={{
              url: `/mapmarkericon.svg`,
              origin: new window.google.maps.Point(0, 0),
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          ></Marker>
        ))}

        {selected && selectedPlace ? (
          <InfoWindow
            anchor={markerMap[selectedPlace.lat - selectedPlace.lng]}
            onCloseClick={() => {
              setSelected(null)
            }}
          >
            <div>
              <h3>{selectedPlace.address}</h3>
              <p>{moment(selectedPlace.date).format('MMMM d, YYYY')}</p>
              <p>
                {selectedPlace.name}: {selectedPlace.comment}
              </p>
              <p>Severity: {selectedPlace.score}/5</p>
              <p>
                Bug Type:{' '}
                {selectedPlace.bug !== 'BOTH'
                  ? selectedPlace.bug === 'BEDBUG'
                    ? 'Bedbugs'
                    : 'Cockroaches'
                  : 'Bedbugs & Cockroaches'}
              </p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}

const Search = ({ panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      // this sets the search to be within this radius, its centered around hamilton
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000
    }
  })

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleSelect = async (address) => {
    setValue(address)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })

      const { lat, lng } = await getLatLng(results[0])
      panTo({ lat, lng })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search city or address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={uuidv4()} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}

export default App
