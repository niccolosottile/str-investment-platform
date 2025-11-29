import React from 'react';
import { Building, Home, Bed } from 'lucide-react';
import { InvestmentOptionCard } from '@/components/features/cards/InvestmentOptionCard';

interface Props {
  propertyType: 'apartment' | 'house' | 'room';
  setPropertyType: (p: 'apartment' | 'house' | 'room') => void;
}

export function PropertyStep({ propertyType, setPropertyType }: Props) {
  const options = [
    {
      type: 'apartment' as const,
      icon: Building,
      title: 'Apartment',
      description: '1-3 bedroom apartments in residential areas',
      pros: ['Lower maintenance', 'Urban locations', 'Higher occupancy'],
    },
    {
      type: 'house' as const,
      icon: Home,
      title: 'House',
      description: 'Standalone houses with garden/terrace',
      pros: ['Family-friendly', 'Higher rates', 'More space'],
    },
    {
      type: 'room' as const,
      icon: Bed,
      title: 'Private Room',
      description: 'Single room in shared accommodation',
      pros: ['Lower investment', 'Flexible', 'High demand'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map(({ type, icon: Icon, title, description, pros }) => (
        <InvestmentOptionCard
          key={type}
          title={title}
          description={description}
          icon={Icon}
          badges={pros}
          selected={propertyType === type}
          onClick={() => setPropertyType(type)}
        />
      ))}
    </div>
  );
}
