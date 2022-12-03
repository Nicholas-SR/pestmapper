import React, { useState, useCallback, useRef, useEffect } from 'react'
import { getAllReports } from './client'
import { errorNotification } from './Notification'
import ReportDrawerForm from './ReportDrawerForm'
import moment from 'moment'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import '@reach/combobox/styles.css'
import { libraries, mapContainerStyle, options, center } from './mapStyles.js'
import './App.css'
import Search from './Search'
import Report from './Report'

function App() {
  const [reportsData, setReportsData] = useState([])
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [reports, setReports] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [markerMap, setMarkerMap] = useState({})
  const [currentMarkers, setCurrentMarkers] = useState([])

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
          ),
          placeId: reportsData[i].placeId
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

  // can it pop up onHover
  const markerClickHandler = (event, marker) => {
    findOtherMarkers(marker.placeId)
    if (mapRef.current.zoom < 14) {
      mapRef.current.setZoom(14)
      panTo({ lat: marker.lat, lng: marker.lng })
    }
    selected && setSelected(false)
    setSelectedPlace(marker)

    setSelected(true)
  }

  useEffect(() => {
    console.log('start fetch')
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (reports.length === reportsData.length && reports.length) {
      setMarkers((current) => [...reports])
    }
  }, [reports, reports.length, reportsData.length])

  const findOtherMarkers = (placeId) => {
    setCurrentMarkers([])
    var markers1 = []
    for (var i = markers.length - 1; i >= 0; i--) {
      if (markers[i].placeId === placeId) {
        markers1.push(markers[i])
      }
    }
    setCurrentMarkers(markers1)
  }

  const shortenAddress = (address) => {
    let splitaddress = address.split(',')
    splitaddress.pop()
    splitaddress.pop()
    let shortaddress = splitaddress.join(',')
    return shortaddress
  }

  if (loadError) return 'Error'
  if (!isLoaded) return 'Loading'

  return (
    <div>
      <div className="header">
        <>
          <img
            src={'/logo.svg'}
            alt="Logo"
          />
          <a href="#default" className="logo">
            Pest <br />
            Mapper
          </a>
        </>
        <a className="pages" href="#map">
          Map
        </a>
        <a className="pages" href="#resources">
          Resources
        </a>
        <a className="pages" href="#about">
          About
        </a>

        <Search
          panTo={panTo}
          placeholder={'Search City Or Address'}
          className={'headerSearch'}
        />

        <button className="btn" onClick={() => setShowDrawer(!showDrawer)}>
          Report Pest
        </button>
      </div>

      <ReportDrawerForm
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        fetchReports={fetchReports}
      />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={() => setSelected(false)}
        clickableIcons={false}
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
            id="infowindow"
            anchor={markerMap[selectedPlace.lat - selectedPlace.lng]}
            onCloseClick={() => {
              setSelected(null)
            }}
          >
            <div id="popup">
              <div className="popupheader">
                <img
                  className="addresspic"
                  src={
                    'https://maps.googleapis.com/maps/api/streetview?size=480x480&location=' +
                    selectedPlace.lat +
                    ',' +
                    selectedPlace.lng +
                    '&key=' +
                    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                  }
                />
                <span className="popupaddress">
                  {shortenAddress(selectedPlace.address)}
                </span>
              </div>
              {currentMarkers.map((reportdata) => {
                return <Report reportdata={reportdata}></Report>
              })}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}

export default App
