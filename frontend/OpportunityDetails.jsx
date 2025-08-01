import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function OpportunityDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/opportunities/${id}`);
        setOpportunity(response.data);
      } catch (err) {
        setError('Failed to fetch opportunity details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">جاري تحميل تفاصيل الفرصة...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!opportunity) {
    return <div className="text-center py-8">لم يتم العثور على تفاصيل لهذه الفرصة.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">{opportunity.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={opportunity.image_url || 
            (opportunity.sector === 'صناعة' ? '/src/assets/industry.jpg' :
            opportunity.sector === 'تقنية' ? '/src/assets/technology.jpg' :
            opportunity.sector === 'عقارات' ? '/src/assets/real_estate.jpg' :
            opportunity.sector === 'تجارة' ? '/src/assets/commerce.jpg' :
            opportunity.sector === 'زراعة' ? '/src/assets/agriculture.jpg' :
            opportunity.sector === 'سياحة' ? '/src/assets/tourism.jpg' :
            '/src/assets/default.jpg')
          } alt={opportunity.title} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
          <p className="text-gray-700 mb-4">{opportunity.description}</p>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-xl font-semibold text-primary mb-2">تفاصيل المشروع</h2>
            <p><strong>الموقع:</strong> {opportunity.location}</p>
            <p><strong>تاريخ النشر:</strong> {opportunity.date}</p>
            <p><strong>القطاع:</strong> {opportunity.sector}</p>
            <p><strong>الاستثمار المطلوب:</strong> {opportunity.investment_required} ريال</p>
            <p><strong>العائد المتوقع:</strong> {opportunity.expected_return}</p>
          </div>
        </div>
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-xl font-semibold text-primary mb-2">بيانات الملكية والتراخيص</h2>
            <p>{opportunity.ownership_data}</p>
            <p>{opportunity.licenses}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-xl font-semibold text-primary mb-2">الجدوى الاقتصادية</h2>
            <p>{opportunity.economic_feasibility}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-xl font-semibold text-primary mb-2">تقييم المجتمع المحلي</h2>
            <p><strong>مؤشر القبول المجتمعي:</strong> {opportunity.community_acceptance_index}</p>
            <p><strong>التقييمات:</strong> {opportunity.community_rating}</p>
          </div>
          {/* Add map integration here later */}
        </div>
      </div>
    </div>
  );
}

export default OpportunityDetails;


