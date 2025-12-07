import React from 'react'
import scooter from '../assets/scooter.png'
import home from '../assets/home.png'
import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer ,Polyline} from 'react-leaflet';

const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
    
})

const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
    
})

function DeliveryBoyTrackinig({data}) {
    const deliveryBoyLat = data.deliveryBoyLocation.latitude
    const deliveryBoyLng = data.deliveryBoyLocation.longitude
    const customerLat = data.customerLocation.latitude
    const customerLng = data.customerLocation.longitude

    const path = [
        [deliveryBoyLat, deliveryBoyLng],
        [customerLat, customerLng]
    ]

    const center = [deliveryBoyLat, deliveryBoyLng]

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            <MapContainer
                className={'w-full h-full'}
                center={center}
                zoom={16}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            <Marker position={[deliveryBoyLat,deliveryBoyLng]}icon={deliveryBoyIcon}>
                <Popup>
                    Delivery Boy
                </Popup>

            </Marker>
            <Marker position={[customerLat,customerLng]} icon={customerIcon}>
                <Popup>
                    Customer Location
                </Popup>
            </Marker>
            <Polyline
                positions={path}
                color='blue'
                weight={4}
               />
            
            


            </MapContainer>



        </div>
    )
}

export default DeliveryBoyTrackinig
