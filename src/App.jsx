import { useState } from 'react';
import { Button, Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Home from './Home';
import Create from './Create';
import Details from './Details';
import MapScreen from './MapScreen';
import FieldsMap from './FieldsMap';
import CropYieldMap from './CropYieldMap';
import LSTMap from './LstMap';
import SoilMap from './SoilMap';
import SolarLocation from './SolarLocation';
import MauzaCropYield from './MauzaCropYield';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          className="sidebar" // Applies the gradient background
        >
          <Logo collapsed={collapsed} />
          <MenuList />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              backgroundColor: '#f5f5f5', // Set to a light color to remove black background
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
              }}
            >
              <Button
                type="text"
                className="toggle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                PSIC Dashboard,
              </span>
            </div>
          </Header>
          <Content
            style={{
              padding: 24,
            }}
          >
            <Routes>
              <Route path="/PSIC/" element={<Navigate to="/map" />} /> {/* Redirect to /map on load */}
              <Route path="/home" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/details" element={<Details />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/map/fields-map" element={<FieldsMap />} />
              <Route path="/map/crop-yield-map" element={<CropYieldMap />} />
              <Route path="/map/lst-map" element={<LSTMap />} />
              <Route path="/map/soil-map" element={<SoilMap />} />
              <Route path="/map/solar-location" element={<SolarLocation />} />
              <Route path="/map/mauza-crop-yield-map" element={<MauzaCropYield />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
