import React, { useEffect, useState, useRef } from "react";
import { UpOutlined, DownOutlined, DeploymentUnitOutlined, FunnelPlotOutlined, LeftOutlined, RightOutlined, PicLeftOutlined } from '@ant-design/icons';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { newJSON } from '../json/Json';
import { Link, useLocation } from 'react-router-dom';
import * as turf from '@turf/turf';

const MapComponent = () => {
  const mapRef = useRef(null);
  const selectedLayerRef = useRef(null);
  const mapRefInstance = useRef();
  const [selectedDivision, setSelectedDivision] = useState('Lahore');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [selectedMouza, setSelectedMouza] = useState('');
  const [selectedGrwName, setSelectedGrwName] = useState('');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
  const [panelData, setPanelData] = useState({
    title: "Default Data",
    data: [
      { title: "Industrial Name:", value: "N/A" },
      { title: "Owner Name:", value: "N/A" },
      { title: "Phone Number:", value: "N/A" },
      { title: "CNIC:", value: "N/A" },
      { title: "Type of Allottment:", value: "N/A" },
      { title: "Industry Type:", value: "N/A" },
      { title: "Email:", value: "N/A" },
      { title: "Address:", value: "N/A" },
    ],
  });


  const location = useLocation();
  const selectedKey = location.pathname === '/map/fields-map' ? '1' : location.pathname === '/map/crop-yield-map' ? '2' : location.pathname === '/map/lst-map' ? '3' : location.pathname === '/map/soil-map' ? '4' : '5';

  const toggleRightPanel = () => {
    setIsRightPanelVisible(prev => !prev);
  };

  // Extract unique values for dropdowns
  const divisions = [...new Set(newJSON.features.map(feature => feature.properties.Region))];
  const districts = [...new Set(newJSON.features.map(feature => feature.properties.Estate))];
  const tehsils = [...new Set(newJSON.features.map(feature => feature.properties.P_Status))];
  const industryTypes = [...new Set(newJSON.features.map(feature => feature.properties.Industry_T))];
  const unitNumbers = [...new Set(newJSON.features.map(feature => feature.properties.Unit_No))];

  // Filter Industry Types based on selected Project Status (Tehsil)
  const filteredIndustryTypes = selectedTehsil
    ? [...new Set(newJSON.features.filter(feature => feature.properties.P_Status === selectedTehsil).map(feature => feature.properties.Industry_T))]
    : [];

  // Filter Unit Numbers based on selected Project Status and Industry Type
  const filteredUnitNumbers = selectedTehsil && selectedMouza
    ? [...new Set(newJSON.features.filter(feature => feature.properties.P_Status === selectedTehsil && feature.properties.Industry_T === selectedMouza).map(feature => feature.properties.Unit_No))]
    : [];

  useEffect(() => {
    mapRefInstance.current = L.map(mapRef.current).setView([30.3753, 69.3451], 11);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    ).addTo(mapRefInstance.current);

    const bounds = [[29.1623, 71.3782]];
    mapRefInstance.current.fitBounds(bounds);

    const interactiveLayer = L.geoJSON(newJSON, {
      style: { color: "yellow", weight: 1 }, // Change default color to yellow
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          if (selectedLayerRef.current) {
            interactiveLayer.resetStyle(selectedLayerRef.current);
          }
          selectedLayerRef.current = layer;
          layer.setStyle({ color: "red", weight: 3 });
          mapRefInstance.current.flyToBounds(layer.getBounds(), { duration: 1.5 });
        });
      },
    }).addTo(mapRefInstance.current);

    return () => {
      mapRefInstance.current.remove();
    };
  }, []);

  const handleFilter = () => {
    // Filter the features based on selected criteria
    const filteredFeatures = newJSON.features.filter(feature => {
      const properties = feature.properties;
      return (
        (!selectedDivision || properties.Region === selectedDivision) &&
        (!selectedDistrict || properties.Estate === selectedDistrict) &&
        (!selectedTehsil || properties.P_Status === selectedTehsil) &&
        (!selectedMouza || properties.Industry_T === selectedMouza) &&
        (!selectedGrwName || properties.Unit_No === selectedGrwName)
      );
    });

    const selectedFeature = filteredFeatures[0];

    // Common metrics (Total Units, Non-Functional Units, etc.)
    const totalUnits = filteredFeatures.length;
    const nonFunctionalUnits = filteredFeatures.filter(feature => feature.properties.P_Status === 'Non Functional').length;
    const functionalUnits = filteredFeatures.filter(feature => feature.properties.P_Status === 'Functional').length;
    const vacantUnits = filteredFeatures.filter(feature => feature.properties.P_Status === 'Others').length;
    const industrialName = selectedFeature.properties.Industrial || "N/A";
    const ownerName = selectedFeature.properties.Name___Fat || "N/A";
    const phoneNumber = selectedFeature.properties.Phone || "N/A";
    const cnic = selectedFeature.properties.CNIC_No || "N/A";
    const typeofAll = selectedFeature.properties.Type_of__A || "N/A";
    const industryType = selectedFeature.properties.Industry_T || "N/A";
    const email = selectedFeature.properties.Email || "N/A";
    const address = selectedFeature.properties.Current_Ad || "N/A";
    

    // Calculate total area using Turf.js
    const totalArea = filteredFeatures.reduce((acc, feature) => {
      if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
        const area = turf.area(feature);  // Area in square meters
        return acc + area;
      }
      return acc;
    }, 0);

    // Set the panel data based on the selected filter
    if (selectedGrwName) {  // If Estate (district) is selected
      setPanelData({
        title: "Filtered Data",
        data: [
          { title: "Industrial Name:", value: industrialName.toString() },
          { title: "Owner Name:", value: ownerName.toString() },
          { title: "Phone Number:", value: phoneNumber.toString() },
          { title: "CNIC:", value: cnic.toString() },
          { title: "Type of Allottment:", value: typeofAll.toString() },
          { title: "Industry Type:", value: industryType.toString() },
          { title: "Email:", value: email.toString() },
          { title: "Address:", value: address.toString() },

        ],
      });
    }else if (selectedTehsil) {  // If Project Status is selected (Tehsil)
      setPanelData({
        title: "Filtered Data",
        data: [
          { title: "Total Plots/ Units:", value: totalUnits.toString() },

          { title: "Total Area (sq. meters):", value: totalArea.toFixed(2) },
        ],
      });
    } else if (selectedDistrict) {  // If Estate (district) is selected
      setPanelData({
        title: "Filtered Data",
        data: [
          { title: "Total Plots/ Units:", value: totalUnits.toString() },
          { title: "Functional Units:", value: functionalUnits.toString() },
          { title: "Non Functional Units:", value: nonFunctionalUnits.toString() },
          { title: "Vacant Units:", value: vacantUnits.toString() },
          { title: "Total Area (sq. meters):", value: totalArea.toFixed(2) },

        ],
      });
    }

    // Open the panel automatically when a filter is applied
    setIsPanelVisible(true);

    // Apply the filtered layer to the map
    const filteredLayer = L.geoJSON(filteredFeatures, {
      style: { color: "yellow", weight: 2 },
    }).addTo(mapRefInstance.current);

    // Remove any previously added highlighted layers
    if (selectedLayerRef.current) {
      mapRefInstance.current.removeLayer(selectedLayerRef.current);
    }

    // Highlight layers based on the selected Project Status (Tehsil)
    if (selectedTehsil) {
      const filteredTehsilFeatures = filteredFeatures.filter(feature => feature.properties.P_Status === selectedTehsil);

      const highlightedLayers = [];
      filteredTehsilFeatures.forEach((feature) => {
        const layer = L.geoJSON(feature, {
          style: { color: "red", weight: 3 }, // Highlight style
        }).addTo(mapRefInstance.current);

        highlightedLayers.push(layer);

        // If clicked, fly to bounds of that feature
        layer.on("click", () => {
          mapRefInstance.current.flyToBounds(layer.getBounds(), { duration: 1.5 });
        });
      });

      if (highlightedLayers.length > 0) {
        selectedLayerRef.current = L.layerGroup(highlightedLayers).addTo(mapRefInstance.current);
      }
    }

    if (filteredFeatures.length > 0) {
      const bounds = filteredLayer.getBounds();
      mapRefInstance.current.flyToBounds(bounds, { duration: 1.5 });
    } else {
      alert('No features match the selected filters.');
    }
  };

  const handleTehsilChange = (e) => {
    // Set the selected Project Status (Tehsil)
    const selectedTehsilValue = e.target.value;
    setSelectedTehsil(selectedTehsilValue);

    // No highlighting here anymore, highlight will happen after the filter button click.
  };

  const togglePanel = () => {
    setIsPanelVisible(prev => !prev);
  };

  return (
    <>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      <div style={filterContainerStyle}>
        <select onChange={(e) => setSelectedDivision(e.target.value)} value={selectedDivision} style={selectStyle}>
          <option value="">Region</option>
          {divisions.map(division => (
            <option key={division} value={division}>{division}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict} style={selectStyle}>
          <option value="">Estate</option>
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <select onChange={handleTehsilChange} value={selectedTehsil} style={selectStyle}>
          <option value="">Project Status</option>
          {tehsils.map(tehsil => (
            <option key={tehsil} value={tehsil}>{tehsil}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedMouza(e.target.value)} value={selectedMouza} style={selectStyle}>
          <option value="">Industry Type</option>
          {filteredIndustryTypes.map(mouza => (
            <option key={mouza} value={mouza}>{mouza}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedGrwName(e.target.value)} value={selectedGrwName} style={selectStyle}>
          <option value="">Unit No</option>
          {filteredUnitNumbers.map(grwName => (
            <option key={grwName} value={grwName}>{grwName}</option>
          ))}
        </select>
        <button onClick={handleFilter} style={buttonStyle}>Filter</button>
      </div>

      <button onClick={togglePanel} style={roundButtonStyle}>
        <span style={{ fontWeight: "bold", fontSize: "20px" }}><UpOutlined /></span>
      </button>

      <div style={{ ...panelStyle, transform: isPanelVisible ? "translateY(0)" : "translateY(100%)" }}>
        <div style={panelContentStyle}>
          <button onClick={togglePanel} style={closeButtonStyle}>
            <span style={{ fontWeight: "bold", fontSize: "20px" }}><DownOutlined /></span>
          </button>
          <div style={dataCardContainer}>
            {panelData.data.map((item, index) => (
              <DataCard key={index} title={item.title} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const DataCard = ({ title, value }) => (
  <div style={dataCardStyle}>
    <h4 style={dataTitleStyle}>{title}</h4>
    <p style={dataValueStyle}>{value}</p>
  </div>
);

// Styles
const filterContainerStyle = {
  position: "absolute",
  top: "4%",
  left: "50%",
  transform: "translateX(-50%)",
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  zIndex: 1000,
  background: "rgba(255, 255, 255, 0.6)",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",

  alignItems: "center",
  gap: "10px",
  maxWidth: "90%",
  overflow: "hidden",
};



const selectStyle = {
  flex: '1 1 120px',
  minWidth: '120px',

  padding: "8px",
  borderRadius: "4px",
  border: "1px solid rgba(0, 0, 0, 0.6)",
  background: "white",
  color: "black",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  fontSize: "14px",
  cursor: "pointer",
  maxWidth: "150px",
  flexGrow: 1,
  transition: "border 0.3s",
};

const buttonStyle = {
  padding: '10px 15px',
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#1fd655",
  color: "white",
  fontSize: "14px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  alignSelf: 'center',
  flexShrink: 0,
};

const roundButtonStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "40px",
  height: "40px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "50%",
  border: "1px solid rgba(0, 0, 0, 0.3)",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const rightToggleButtonStyle = {
  position: "absolute",
  top: "50%",
  right: "20px",
  transform: "translateY(-50%)",
  width: "40px",
  height: "40px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "50%",
  border: "1px solid rgba(0, 0, 0, 0.3)",

  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",

  zIndex: 1000,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "30%",
  width: "90%",
  backgroundColor: "#F2F3F2",
  borderTop: '1px solid #ccc',
  padding: '10px',
  boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  transition: "transform 1.7s ease, opacity 0.3s ease", // Increased duration
  zIndex: 1500,
  transform: 'translateY(100%)',
  marginLeft: "5%",
  overflowY: 'auto',
};

const panelContentStyle = {
  padding: "10px 30px 10px 30px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  overflowY: "auto",
};

const closeButtonStyle = {
  fontSize: "20px",
  background: "white",
  border: "1px solid rgba(0, 0, 0, 0.3)",
  borderRadius: "50%",
  color: "#888",
  cursor: "pointer",
  alignSelf: "center",
  width: "30px",
  height: "30px",
  padding: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
};

const dataCardContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "start"

};

const dataCardStyle = {
  // flex: "1 1 calc(25% - 10px)",
  width: "calc(25% - 10px)",

  padding: "10px",
  borderRadius: "5px",
  background: "#f9f9f9",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",           // Centers content vertically
  alignItems: "center",               // Centers content horizontally

  overflow: "hidden",
};

const dataTitleStyle = {
  fontSize: "15px",
  background: "linear-gradient(90deg, #FF5733, #FFC300)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  margin: "0 0 8px",
};

const dataValueStyle = {
  fontSize: "13px",
  background: "black",
  WebkitBackgroundClip: "text",
  color: "transparent",
  fontWeight: "bold",
  margin: 0,
};




const rightPanelStyle = {
  position: "absolute",
  top: "35%",
  right: "0",
  height: "auto",
  borderRadius: "10px",
  width: "50px",
  backgroundColor: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  transition: "transform 0.3s ease",
  zIndex: 1000,
  textAlign: "center",
  padding: "10px 0px 0px 0px"
};


const closeRightPanelButtonStyle = {
  position: 'absolute',
  left: '-50px',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#f4fdf4',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer'
};





export default MapComponent;