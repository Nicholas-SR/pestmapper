import React from 'react'
import { v4 as uuidv4 } from 'uuid'
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

const Search = (props) => {
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
    props.setAddress && props.setAddress(address)
    setValue(address)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      const placeId = results[0].place_id
      const { lat, lng } = await getLatLng(results[0])
      props.panTo && props.panTo({ lat, lng })
      props.setLat && props.setLat(lat)
      props.setLng && props.setLng(lng)
      props.setPlaceId && props.setPlaceId(placeId)
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
          placeholder={props.placeholder}
          style={props.style}
          maxLength={255}
        />
        <ComboboxPopover style={{ zIndex: '12' }}>
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

export default Search
