

import React, { useEffect, useState } from 'react';

interface Staff {
  id: number;
  name: string;
  // other staff fields
}

interface StaffLevel {
  id: number;
  level: string;
  // other staff level fields
}

const fetchStaffLevel = async (staffId: number): Promise<StaffLevel> => {
  // Replace with your actual API call
  const response = await fetch(`/api/staff-levels/${staffId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff level');
  }
  return response.json();
};

const StaffTab: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffLevels, setStaffLevels] = useState<{ [key: number]: StaffLevel }>({});

  useEffect(() => {
    // Fetch staff data
    const fetchStaff = async () => {
      const response = await fetch('/api/staff');
      const staffData = await response.json();
      setStaff(staffData);

      // Fetch staff levels for each staff member
      const levels: { [key: number]: StaffLevel } = {};
      for (const staffMember of staffData) {
        try {
          const level = await fetchStaffLevel(staffMember.id);
          levels[staffMember.id] = level;
        } catch (error) {
          console.error(`Failed to fetch level for staff ${staffMember.id}`, error);
        }
      }
      setStaffLevels(levels);
    };

    fetchStaff();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Level</th>
          {/* other headers */}
        </tr>
      </thead>
      <tbody>
        {staff.map((staffMember) => (
          <tr key={staffMember.id}>
            <td>{staffMember.name}</td>
            <td>{staffLevels[staffMember.id]?.level || 'Loading...'}</td>
            {/* other columns */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTab;