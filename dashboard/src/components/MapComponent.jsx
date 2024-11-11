import React, { useEffect, useState, useRef } from "react";
import { UpOutlined, DownOutlined, DeploymentUnitOutlined, FunnelPlotOutlined, LeftOutlined, RightOutlined, PicLeftOutlined } from '@ant-design/icons';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { newJSON } from '../json/Json';
import { Link, useLocation } from 'react-router-dom';

const MapComponent = () => {
  const mapRef = useRef(null);
  const selectedLayerRef = useRef(null);
  const mapRefInstance = useRef();
  const [selectedDivision, setSelectedDivision] = useState('Lahore');
  const [selectedDistrict, setSelectedDistrict] = useState('Sundar(Lahore2)');
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
    if (!selectedDivision || !selectedDistrict || !selectedTehsil || !selectedMouza) {
      alert("Please select an option from all dropdowns.");
      return;
    }

    let filteredFeatures = newJSON.features.filter(feature => (
      feature.properties.Region === selectedDivision &&
      feature.properties.Estate === selectedDistrict &&
      feature.properties.P_Status === selectedTehsil &&
      feature.properties.Industry_T === selectedMouza
    ));

    if (selectedGrwName) {
      filteredFeatures = filteredFeatures.filter(feature =>
        feature.properties.Unit_No === selectedGrwName
      );

      if (filteredFeatures.length === 0) {
        alert(`No features found for the selected criteria including Grw Name: ${selectedGrwName}.`);
        return;
      } else {
        const selectedFeature = filteredFeatures[0];
        setPanelData({
          title: selectedFeature.properties.Unit_No || "N/A",
          data: [
            { title: "Industrial Name:", value: selectedFeature.properties.Industrial || "N/A" },
            { title: "Owner Name:", value: selectedFeature.properties.Name___Fat || "N/A" },
            { title: "Phone Number:", value: selectedFeature.properties.Phone || "N/A" },
            { title: "CNIC:", value: selectedFeature.properties.CNIC_No || "N/A" },
            { title: "Type of Allottment:", value: selectedFeature.properties.Type_of__A || "N/A" },
            { title: "Industry Type:", value: selectedFeature.properties.Industry_T || "N/A" },
            { title: "Email:", value: selectedFeature.properties.Email || "N/A" },
            { title: "Address:", value: selectedFeature.properties.Current_Ad || "N/A" },
          ]
        });
      }
    } else {
      setPanelData({
        title: "Default Data",
        data: [
          { title: "Total Area:", value: "3802 acres" },
          { title: "Field Area:", value: "1934 acres" },
          { title: "Orchards:", value: "1067 acres" },
          { title: "Constructed Area:", value: "606 acres" },
          { title: "Non-Constructed Area:", value: "26 acres" },
          { title: "Nulla:", value: "57 acres" },
        ]
      });
    }

    if (filteredFeatures.length > 0) {
      const bounds = L.geoJSON(filteredFeatures).getBounds();
      mapRefInstance.current.flyToBounds(bounds, { duration: 1.5 });

      if (selectedGrwName) {
        const selectedFeature = newJSON.features.find(feature => feature.properties.Unit_No === selectedGrwName);
        if (selectedFeature) {
          if (selectedLayerRef.current) {
            selectedLayerRef.current.setStyle({ color: "yellow", weight: 1 });
            selectedLayerRef.current.unbindTooltip();
          }

          const layer = L.geoJSON(selectedFeature, {
            style: { color: "red", weight: 3 }
          });

          selectedLayerRef.current = layer;
          layer.addTo(mapRefInstance.current);

          layer.bindTooltip(`Parcel ID: ${selectedFeature.properties.Parcel_ID}`, {
            permanent: true,
            direction: 'top'
          }).openTooltip();

          mapRefInstance.current.flyToBounds(layer.getBounds(), { duration: 1.5 });
        }
      }

      setIsPanelVisible(true);
    } else {
      alert("No features found for the selected criteria.");
    }
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
        <select onChange={(e) => setSelectedTehsil(e.target.value)} value={selectedTehsil} style={selectStyle}>
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

      <div style={{ ...rightPanelStyle, transform: isRightPanelVisible ? "translateX(0)" : "translateX(100%)" }}>
        <button onClick={toggleRightPanel} style={closeRightPanelButtonStyle}>
          {isRightPanelVisible ? <RightOutlined /> : <LeftOutlined />}
        </button>

        <div selectedKeys={[selectedKey]}>
          <button key='1' className="action-btn edit-btn" title="Fields Map">
            <Link to="/map/fields-map"><DeploymentUnitOutlined style={{ color: 'white', fontSize: '15px' }}/></Link>
          </button>
          <button key='2' className="action-btn edit-btn" title="Mauza Crop Yield">
            <Link to="/map/mauza-crop-yield-map"><PicLeftOutlined style={{ color: 'white', fontSize: '15px' }}/></Link>
          </button>
        </div>
      </div>

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
  justifyContent: "space-between"

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