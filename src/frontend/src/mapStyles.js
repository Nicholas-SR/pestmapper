export const libraries = ['places']
export const mapContainerStyle = {
  height: '100vh',
  width: '100vw'
}
export const options = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ],
  disableDefaultUI: false,
  zoomControl: true
}
export const center = {
  lat: 43.255722,
  lng: -79.871101
}
