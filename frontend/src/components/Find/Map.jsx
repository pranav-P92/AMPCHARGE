import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { gsap } from 'gsap';
import './Map.css';
// import dotenv from 'dotenv';


const containerStyle = {
  border: 'none',
  height: '420px',
  width: '700px',
  position: 'absolute',
  right: '0px',
  top: '0px',
  borderRadius: '20px',
};

const mapStyle = {
  width: '100%',
  height: '420px',
  borderRadius: '20px',
  overflow: 'hidden',
};

const mapOptions = {
  mapId: [ENTER-YOUR-MAP-ID], // Replace with your actual map style ID
};

const Map = ({ stations, selectedCard, mapRef }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 17.448796, lng: 78.407816 }); // Default center
  const [userLocation, setUserLocation] = useState(null); // State for user location

  useEffect(() => {
    if (stations.length > 0) {
      const updatedMarkers = stations.map((station) => ({
        id: station._id,
        position: {
          lat: station.location.coordinates[1],
          lng: station.location.coordinates[0],
        },
        title: station.name,
      }));
      setMarkers(updatedMarkers);
    }
  }, [stations]);

  useEffect(() => {
    if (selectedCard && mapRef.current) {
      const { coordinates } = selectedCard.location;
      const newCenter = {
        lat: coordinates[1],
        lng: coordinates[0],
      };

      // Center the map without animation, as GSAP can't directly animate the map properties
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(10);
    }
  }, [selectedCard, mapRef]);

  // Function to handle location request
  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocation); // Update user location state
          setCenter(userLocation); 
          if (mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(15); // Optional: Set zoom level after centering
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };


  return (
    <LoadScript googleMapsApiKey="YOUR-API-KEY">
      <div style={{ position: 'relative' }}>
        <button id="nearby"
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }} 
          onClick={handleLocationAccess}
        >
          Nearby Stations
        </button>
        <div style={containerStyle}>
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={center}
            zoom={11} // Initial zoom level
            options={mapOptions}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker.position} title={marker.title} />
            ))}
            {userLocation && (
              <>
                <Marker
                  position={userLocation}
                  title="Your Location"
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use the default blue dot icon
                    scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
                  }}
                />
                <Circle
                  center={userLocation}
                  radius={100} // Radius in meters, adjust as needed
                  options={{
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#4285F4',
                    fillOpacity: 0.35,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default Map;
