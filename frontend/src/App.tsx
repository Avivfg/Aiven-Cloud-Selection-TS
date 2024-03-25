import React, { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import CloudBox from './components/CloudBox';
import GeoSort from './components/GeoSort';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import { useHistory } from "react-router-dom";

export interface Cloud {
  cloud_id: number;
  cloud_name: string;
  cloud_description: string;
  geo_latitude: number;
  geo_longitude: number;
  geo_region: string;
  provider: string;
  provider_description: string;
}

interface Provider {
  value: string;
  label: string;
}

interface CloudData {
  clouds: Cloud[];
  providers: Provider[];
}

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const App: React.FC = () => {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [showLocationAlert, setShowLocationAlert] = useState<boolean>(false);
  const [selectedClouds, setSelectedClouds] = useState<number[]>([]); // IDs
  const [selectedPresentedClouds, setSelectedPresentedClouds] = useState<number[]>([]); // IDs
  const [isMounted, setIsMounted] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const getUserLocation = async (): Promise<void> => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }
      const position = await new Promise<Position>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      setLocationPermission(true);
      setUserLatitude(latitude);
      setUserLongitude(longitude);
    } catch (error) {
      setShowLocationAlert(true);
      console.log('Error getting user location:', error);
    }
  };

  /* Fetching clouds and providers data */
  const fetchData = async (providers: Provider[] = allProviders, sort = false) => {
    try {
      const reqParams: { [key: string]: string | number | boolean } = {};
      if (providers.length > 0) reqParams['providers_req'] = providers.map((item) => item.value).join(',');

      if (sort) {
        reqParams['sorted_by_geolocation'] = sort;
        reqParams['user_latitude'] = userLatitude || '';
        reqParams['user_longitude'] = userLongitude || '';
      }

      const response = await api.get('/clouds/', { params: reqParams });
      const responseData = response.data as CloudData;
      setClouds(responseData.clouds);
      if (providers.length === 0) setAllProviders(responseData.providers);
      setFetchCount(fetchCount + 1);
    } catch (error) {
      console.log('Error fetching clouds and providers data:', error);
    }
  };

  const handleProviderSelect = (selectedOptions: Provider[]) => {
    try {
      setSelectedProviders(selectedOptions.length > 0 ? selectedOptions : []);
      fetchData(selectedOptions.length > 0 ? selectedOptions : allProviders, sortByDistance).catch((error) => {
        console.log('Error in fetchData:', error);
      });
    } catch (error) {
      console.log('Error in handleProviderSelect:', error);
    }
  };

  const updateSelectedPresentedClouds = () => {
    try {
      const selectedAndPresentedClouds = clouds
        .filter((cloud: Cloud) => cloudSelected(cloud.cloud_id))
        .map((cloud: Cloud) => cloud.cloud_id);
      setSelectedPresentedClouds(selectedAndPresentedClouds);
      // sets only the selected clouds which are also not filtered (by provider)
    } catch (error) {
      console.log('Error in updateSelectedPresentedClouds:', error);
    }
  };

  const handleCardClick = (cloudID: number) => {
    try {
      setSelectedClouds(
        cloudSelected(cloudID)
          ? // add the cloud ID to the selected clouds. If already selected, filter it out.
            selectedClouds.filter((selectedCloudID: number) => selectedCloudID !== cloudID)
          : [...selectedClouds, cloudID],
      );
    } catch (error) {
      console.log('Error in handleCardClick:', error);
    }
  };

  const cloudSelected = (cloudID: number) => selectedClouds.includes(cloudID);

  const handleSortToggleChange = () => {
    try {
      // Fetch the data with the changed sort boolean. If no selected providers, get all.
      fetchData(selectedProviders.length > 0 ? selectedProviders : allProviders, !sortByDistance).catch((error) => {
        console.log('Error in fetchData:', error);
      });
      setSortByDistance(!sortByDistance);
    } catch (error) {
      console.log('Error in handleSortToggleChange:', error);
    }
  };

  const handleCleanUpSelection = () => setSelectedClouds([]);

  /* To be continue... (not a part of this assignment): */
  // const history = useHistory();
  const handleContinueWithSelection = () => {
    // history.push("/clouds-selection", { selectedPresentedClouds });
  };

  /* Update the selected clouds which are also presented as the selection is changed */
  useEffect(() => {
    if (!isMounted) return;
    updateSelectedPresentedClouds();
  }, [selectedClouds, selectedProviders, fetchCount]);

  /* Ask for location permission and data upon mounting */
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    fetchData().catch((error) => {
      console.log('Error in fetchData:', error);
    });
    getUserLocation().catch((error) => {
      console.log('Error in getUserLocation:', error);
    });
  }, [isMounted]);

  const count = 1;

  return (
    <div className="content">
      {/* Navbar for the title */}
      <Navbar />
      <div>
        <h1>
          Count: <h3 data-testid="count">{count}</h3>
        </h1>
      </div>
      {/* Headline, selection count and continue button */}
      {/* (implementation of the button action is out of scope for this assignment) */}
      <div className="container mt-4">
        <div className="row align-items-center justify-content-between mb-4">
          <div className="col">
            <h1>
              {selectedPresentedClouds.length === 1
                ? '1 Selected cloud'
                : `${selectedPresentedClouds.length} Selected clouds`}
            </h1>
          </div>
          <div className="col-auto">
            {' '}
            <button
              disabled={selectedPresentedClouds.length === 0}
              className="btn btn-primary btn-lg"
              onClick={handleContinueWithSelection}
            >
              Continue {'>'}
            </button>
          </div>
        </div>

        {/* Search bar for filtering by provider/s */}
        {allProviders.length > 0 && (
          <Select
            options={allProviders}
            isMulti
            value={selectedProviders}
            onChange={(selectedOptions) => handleProviderSelect(selectedOptions as Provider[])}
            placeholder="Select Providers..."
          />
        )}

        {/* Sort by distance feature */}
        <GeoSort
          locationPermission={locationPermission}
          sortByDistance={sortByDistance}
          handleSortToggleChange={handleSortToggleChange}
          show={showLocationAlert}
          setShow={setShowLocationAlert}
        />

        {/* Cleanup selection button */}
        <div className="container mb-2">
          <button
            disabled={selectedPresentedClouds.length === 0}
            className="btn btn-sm btn-primary"
            onClick={handleCleanUpSelection}
          >
            Clean up selection
          </button>
        </div>

        {/* Clouds listing */}
        {clouds ? (
          <div className="row">
            {clouds.map((cloud) => (
              <CloudBox
                cloud={cloud}
                key={cloud.cloud_id}
                selected={cloudSelected(cloud.cloud_id)}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* Another continue button for the bottom */}
        <div className="row align-items-right mb-4">
          {' '}
          <button
            disabled={selectedPresentedClouds.length === 0}
            className="btn btn-primary btn-lg"
            onClick={handleContinueWithSelection}
          >
            Continue with your selection {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
