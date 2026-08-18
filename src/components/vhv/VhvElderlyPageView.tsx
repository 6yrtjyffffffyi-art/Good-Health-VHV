import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import { VhvElderlyListView } from './VhvElderlyListView';
import { VhvHealthDetailView } from './VhvHealthDetailView';

export const VhvElderlyPageView: React.FC = () => {
  const { allPatients, setActiveTab } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [activeMenuKey, setActiveMenuKey] = useState<'vitals' | 'symptoms' | 'meds' | 'calendar' | 'nhso' | 'hospitals'>('vitals');

  if (selectedPatient) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <VhvHealthDetailView
          patient={selectedPatient}
          patientId={selectedPatient.id}
          menuKey={activeMenuKey}
          initialTab={activeMenuKey}
          onBack={() => setSelectedPatient(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <VhvElderlyListView
        menuTitle="รายชื่อผู้สูงอายุในความดูแล"
        menuKey={activeMenuKey}
        onSelectPatient={(patient) => {
          setSelectedPatient(patient);
        }}
        onBackToMenu={() => {
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
};
