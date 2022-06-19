import React, { useEffect } from 'react'
import { TileLayer, LayersControl, useMapEvents, FeatureGroup} from 'react-leaflet'
import {Positions, ZoneULP, ZoneULR } from './Positions';
import { GlobalContext } from '../context/GlobalContext';

const mTitAttrOSM='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | <a href="http://lemz.ru/автоматизированные-системы/" target="_blank">ПАО "НПО "Алмаз" НПЦ-СПб</a>';
const mTitAttrSat='&copy; <a href="https://www.google.com/intl/ru_ru/help/terms_maps/">GoogleMaps</a> | <a href="http://lemz.ru/автоматизированные-системы/" target="_blank">ПАО "НПО "Алмаз" НПЦ-СПб</a>';

const Layers = (props) => { 
	//console.log("Render Layers", props)	
	const ctxt = React.useContext(GlobalContext)

	const mapE = useMapEvents({		
		zoomend: () => {		  
			  localStorage.setItem('zoomM', mapE.getZoom());		  
		},
		moveend: () => {						
			localStorage.setItem('centerM', JSON.stringify([mapE.getCenter().lat,mapE.getCenter().lng]));
		},
		overlayadd: (e)=>{
			if (e.name===('МПСН')){
				ctxt.showMLAT = true
				console.log("Enable MPSN",ctxt.showMLAT)
			}
			if (e.name===('АЗН-В')){
				ctxt.showADSB = true
				console.log("Enable ADSB",ctxt.true)
			}

	   	},
		click: () => {		  
			console.log("PressMap!!!")
			props.click(-1)
	  	},
	   	overlayremove: (e)=>{	
			if (e.name===('МПСН')){
				ctxt.showMLAT = false
				console.log("Disable MPSN",ctxt.showMLAT)
			}

			if (e.name===('АЗН-В')){
				ctxt.showADSB = false
				console.log("Disable ADSB",ctxt.showADSB)
			}
		}
	})

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
			<LayersControl  position="topright">
				<LayersControl.Overlay checked  name={'АЗН-В'} >
					<FeatureGroup>
					</FeatureGroup>
				</LayersControl.Overlay>
				<LayersControl.Overlay checked  name={'МПСН'} >
					<FeatureGroup>
					</FeatureGroup>
				</LayersControl.Overlay>
			</LayersControl>	   
    	</>
  	)
}

export default Layers