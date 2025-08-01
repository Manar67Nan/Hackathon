import React from 'react';
import InteractiveMap from '../components/InteractiveMap';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            الخريطة التفاعلية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            استكشف الفرص الاستثمارية في منطقة عسير من خلال الخريطة الحرارية التفاعلية. 
            يمكنك تصفية الفرص حسب القطاع والموقع لاكتشاف أفضل الاستثمارات المناسبة لك.
          </p>
        </div>
        
        <InteractiveMap />
      </div>
    </div>
  );
};

export default MapPage;

