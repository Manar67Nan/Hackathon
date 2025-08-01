import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Eye, Heart, MessageCircle, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Asir region coordinates and boundaries
const ASIR_CENTER = [18.2465, 42.5085]; // Abha coordinates
const ASIR_BOUNDS = [
  [17.0, 41.0], // Southwest
  [20.0, 44.0]  // Northeast
];

// Sample locations in Asir region
const ASIR_LOCATIONS = [
  { name: 'أبها', lat: 18.2465, lng: 42.5085, opportunities: 15 },
  { name: 'خميس مشيط', lat: 18.3000, lng: 42.7333, opportunities: 12 },
  { name: 'بيشة', lat: 19.9833, lng: 42.6000, opportunities: 8 },
  { name: 'النماص', lat: 19.1667, lng: 42.1500, opportunities: 6 },
  { name: 'تنومة', lat: 18.9167, lng: 42.1333, opportunities: 4 },
  { name: 'رجال ألمع', lat: 18.2000, lng: 42.3167, opportunities: 7 },
  { name: 'محايل عسير', lat: 18.5167, lng: 42.0500, opportunities: 9 },
  { name: 'سراة عبيدة', lat: 18.6833, lng: 42.4167, opportunities: 5 },
  { name: 'ظهران الجنوب', lat: 17.4833, lng: 42.6667, opportunities: 3 },
  { name: 'بلقرن', lat: 19.8000, lng: 41.9000, opportunities: 4 }
];

// Sector colors matching the platform theme
const SECTOR_COLORS = {
  'سياحة': '#3DAED4',
  'زراعة': '#4B8B29',
  'عقارات': '#C2372D',
  'تقنية': '#6B7280',
  'تجارة': '#9CA3AF',
  'صناعة': '#F59E0B',
  'خدمات': '#8B5CF6',
  'طاقة': '#EF4444',
  'تعليم': '#10B981',
  'صحة': '#F97316'
};

const HeatMapLayer = ({ opportunities }) => {
  const map = useMap();

  useEffect(() => {
    // Create heat map circles for each location
    opportunities.forEach(opportunity => {
      if (opportunity.latitude && opportunity.longitude) {
        const circle = L.circleMarker([opportunity.latitude, opportunity.longitude], {
          radius: Math.sqrt(opportunity.budget_required / 100000) * 5, // Scale based on budget
          fillColor: SECTOR_COLORS[opportunity.sector] || '#6B7280',
          color: SECTOR_COLORS[opportunity.sector] || '#6B7280',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6
        }).addTo(map);

        circle.bindPopup(`
          <div style="direction: rtl; font-family: 'Tajawal', sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${opportunity.title}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📍 ${opportunity.location}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">🏢 ${opportunity.sector}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">💰 ${opportunity.budget_required?.toLocaleString()} ريال</p>
            <div style="display: flex; gap: 8px; font-size: 11px; color: #888;">
              <span>❤️ ${opportunity.likes_count}</span>
              <span>💬 ${opportunity.comments_count}</span>
              <span>⭐ ${opportunity.community_acceptance}%</span>
            </div>
          </div>
        `);
      }
    });

    return () => {
      map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, opportunities]);

  return null;
};

const InteractiveMap = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, selectedSector, selectedLocation]);

  const fetchOpportunities = async () => {
    try {
      // Generate sample data for demonstration
      const sampleOpportunities = [
        {
          id: 1,
          title: 'منتجع سياحي في أبها',
          location: 'أبها',
          sector: 'سياحة',
          latitude: 18.2465,
          longitude: 42.5085,
          budget_required: 5000000,
          likes_count: 25,
          comments_count: 8,
          community_acceptance: 85
        },
        {
          id: 2,
          title: 'مزرعة عضوية في النماص',
          location: 'النماص',
          sector: 'زراعة',
          latitude: 19.1667,
          longitude: 42.1500,
          budget_required: 2000000,
          likes_count: 18,
          comments_count: 5,
          community_acceptance: 92
        },
        {
          id: 3,
          title: 'مجمع تجاري في خميس مشيط',
          location: 'خميس مشيط',
          sector: 'تجارة',
          latitude: 18.3000,
          longitude: 42.7333,
          budget_required: 8000000,
          likes_count: 32,
          comments_count: 12,
          community_acceptance: 78
        },
        {
          id: 4,
          title: 'مشروع إسكان في بيشة',
          location: 'بيشة',
          sector: 'عقارات',
          latitude: 19.9833,
          longitude: 42.6000,
          budget_required: 15000000,
          likes_count: 45,
          comments_count: 20,
          community_acceptance: 88
        },
        {
          id: 5,
          title: 'مركز تقني في تنومة',
          location: 'تنومة',
          sector: 'تقنية',
          latitude: 18.9167,
          longitude: 42.1333,
          budget_required: 3000000,
          likes_count: 22,
          comments_count: 7,
          community_acceptance: 75
        }
      ];
      
      setOpportunities(sampleOpportunities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    if (selectedSector) {
      filtered = filtered.filter(opp => opp.sector === selectedSector);
    }

    if (selectedLocation) {
      filtered = filtered.filter(opp => opp.location === selectedLocation);
    }

    setFilteredOpportunities(filtered);
  };

  const sectors = [...new Set(opportunities.map(opp => opp.sector))];
  const locations = [...new Set(opportunities.map(opp => opp.location))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Filter className="h-5 w-5" />
            <span>تصفية الفرص</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">القطاع</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">جميع القطاعات</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الموقع</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">جميع المواقع</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedSector('');
                  setSelectedLocation('');
                }}
                variant="outline"
                className="w-full"
              >
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <CardTitle>الخريطة الحرارية للفرص الاستثمارية</CardTitle>
          <CardDescription>
            عرض تفاعلي للفرص الاستثمارية في منطقة عسير - حجم الدائرة يمثل حجم الاستثمار المطلوب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={ASIR_CENTER}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
              maxBounds={ASIR_BOUNDS}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* City markers */}
              {ASIR_LOCATIONS.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                >
                  <Popup>
                    <div style={{ direction: 'rtl', fontFamily: "'Tajawal', sans-serif" }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        {location.name}
                      </h3>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        {location.opportunities} فرصة استثمارية
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Heat map layer */}
              <HeatMapLayer opportunities={filteredOpportunities} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="afaq-card border-0 afaq-shadow">
        <CardHeader>
          <CardTitle>دليل الألوان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
              <div key={sector} className="flex items-center space-x-2 rtl:space-x-reverse">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm">{sector}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="afaq-card border-0 afaq-shadow text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {filteredOpportunities.length}
            </div>
            <div className="text-gray-600">فرصة معروضة</div>
          </CardContent>
        </Card>
        
        <Card className="afaq-card border-0 afaq-shadow text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-secondary mb-2">
              {filteredOpportunities.reduce((sum, opp) => sum + opp.budget_required, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">إجمالي الاستثمار (ريال)</div>
          </CardContent>
        </Card>
        
        <Card className="afaq-card border-0 afaq-shadow text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-destructive mb-2">
              {Math.round(filteredOpportunities.reduce((sum, opp) => sum + opp.community_acceptance, 0) / filteredOpportunities.length) || 0}%
            </div>
            <div className="text-gray-600">متوسط القبول المجتمعي</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMap;

