import React from 'react'
import { TileLayer, LayersControl} from 'react-leaflet'
import {Positions, ZoneULP, ZoneULR } from './Positions';
import {MLATTargets, ADSBTargets } from './Targets';

const mTitAttrOSM='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | <a href="http://lemz.ru/автоматизированные-системы/" target="_blank">ПАО "НПО "Алмаз" НПЦ-СПб</a>';
const mTitAttrSat='&copy; <a href="https://www.google.com/intl/ru_ru/help/terms_maps/">GoogleMaps</a> | <a href="http://lemz.ru/автоматизированные-системы/" target="_blank">ПАО "НПО "Алмаз" НПЦ-СПб</a>';

const Layers = (props) => { 
	
	const handleShow = (event) =>{

		console.log("Click!!",event.target)
	}

   	return (
    	<>
      		<LayersControl  position="topright">          		
				<LayersControl.BaseLayer checked name="OpenStreet">
					<TileLayer			  	
						attribution={mTitAttrOSM}
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>   
				</LayersControl.BaseLayer>
				  
				<LayersControl.BaseLayer name="Google">
					<TileLayer
						attribution={mTitAttrSat}
						url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"				  		
						subdomains={['mt1','mt2','mt3']}
					/>   
				</LayersControl.BaseLayer>  
  
				<LayersControl.BaseLayer name="Satellite">
					<TileLayer
						attribution={mTitAttrSat}
						url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"				  		
						subdomains={['mt1','mt2','mt3']}
					/>   
				</LayersControl.BaseLayer> 					
				<LayersControl.Overlay checked  name={'Позиции'} >
					<Positions/>
				</LayersControl.Overlay>
				<LayersControl.Overlay checked  name={'Зоны запрета'} >
					<ZoneULP/>
				</LayersControl.Overlay>
				<LayersControl.Overlay checked  name={'Зона ограничения'} >
					<ZoneULR/>
				</LayersControl.Overlay>										 
			</LayersControl>			
    	</>
  	)
}

export default Layers