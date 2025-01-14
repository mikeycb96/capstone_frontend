import Map from "../components/RouteContainerComponents/Map";
import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import RouteList from "../components/RouteContainerComponents/RouteList";
import SelectedRouteList from "../components/RouteContainerComponents/SelectedRouteList";
import { OrderContext } from "../components/contexts/OrderContext";
import "./RouteContainer.css";

const RouteContainer = () => {
  const [routeList, setRouteList] = useState([]);
  const [selectedRouteList, setSelectedRouteList] = useState([]);
  const { selectedOrderList, setSelectedOrderList } = useContext(OrderContext);
  const map = useRef(null);

  const fetchRoutes = async () => {
    const response = await fetch("http://localhost:8080/routes");
    const data = await response.json();
    setRouteList(data);
  };

  const generateRoute = async () => {
    let orderIdList = []; //[1,3,5,9]
    for (let i = 0; i < selectedOrderList.length; i++) {
      orderIdList.push(selectedOrderList[i].id);
    }
    console.log(orderIdList);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routeName: "Route 001",
        orderIds: orderIdList,
        distance: 0,
        startLocationLong: 51.500832,
        startLocationLat: -0.124638
      })
    };
    const response = await fetch("http://localhost:8080/routes", requestOptions);
    window.location.reload(false);
  };

  const addToSelectedRouteList = (routeToAdd) => {
    const updatedSelectedRoutes = [...selectedRouteList, routeToAdd];
    setSelectedRouteList(updatedSelectedRoutes);
  };
  const removeFromSelectedRouteList = (routeToRemove) => {
    setSelectedRouteList(selectedRouteList.filter((route) => route.id !== routeToRemove.id));
  };

  const showLayer = (layerId) => {
    map.current.setLayoutProperty(layerId, "visibility", "visible");
  };

  const hideLayer = (layerId) => {
    map.current.setLayoutProperty(layerId, "visibility", "none");
  };

  useEffect(() => {
    console.log(selectedRouteList);
  }, [selectedRouteList]);

  return (
    <div className="route-container">
      <div className="route-header">
        <Link to="/">
        <button class="edit-order-button">
          <p>EDIT ORDERS</p>
          </button>
        </Link>
        <button className="generate-button"onClick={generateRoute}>GENERATE ROUTES</button>
      </div>
      <div className="route-map">
        <div className="route-list">
          <RouteList
            routes={routeList}
            addToSelectedRouteList={addToSelectedRouteList}
            removeFromSelectedRouteList={removeFromSelectedRouteList}
            showLayer={showLayer}
            hideLayer={hideLayer}
          />
        </div>
        <div className="map">
          <Map
            map={map}
            fetchRoutes={fetchRoutes}
            showLayer={showLayer}
            hideLayer={hideLayer}
            routes={routeList}
          />
        </div>
      </div>
      <div className="selected-route-list">
        <SelectedRouteList selectedRoutes={selectedRouteList} />
      </div>
    </div>
  );
};

export default RouteContainer;
