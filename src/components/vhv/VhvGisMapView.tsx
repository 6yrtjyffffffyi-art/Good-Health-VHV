import React from 'react';
import { VhvGpsMapView } from './VhvGpsMapView';
import { PatientProfile } from '../../types';

interface VhvGisMapViewProps {
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const VhvGisMapView: React.FC<VhvGisMapViewProps> = (props) => {
  return <VhvGpsMapView {...props} />;
};
