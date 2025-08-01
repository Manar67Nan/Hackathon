import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOpportunities();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortOpportunities();
  }, [opportunities, searchTerm, selectedSector, selectedLocation, sortBy]);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/opportunities?page=${currentPage}`);
      setOpportunities(response.data.opportunities);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setLoading(false);
    }
  };

  const filterAndSortOpportunities = () => {
    let filtered = opportunities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.includes(searchTerm) || 
        opp.description.includes(searchTerm) ||
        opp.location.includes(searchTerm)
      );
    }

    // Sector filter
    if (selectedSector) {
      filtered = filtered.filter(opp => opp.sector === selectedSector);
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(opp => opp.location === selectedLocation);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'budget_asc':
          return a.budget_required - b.budget_required;
        case 'budget_desc':
          return b.budget_required - a.budget_required;
        case 'roi_desc':
          return (b.expected_roi || 0) - (a.expected_roi || 0);
        case 'popularity':
          return b.likes_count - a.likes_count;
        case 'community_acceptance':
          return b.community_acceptance - a.community_acceptance;
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredOpportunities(filtered);
  };

  const sectors = [...new Set(opportunities.map(opp => opp.sector))];
  const locations = [...new Set(opportunities.map(opp => opp.location))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الفرص الاستثمارية...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            الفرص الاستثمارية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            اكتشف أفضل الفرص الاستثمارية في منطقة عسير. جميع المشاريع محمية بنظام الملكية الفكرية ومقيمة من المجتمع المحلي.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="afaq-card border-0 afaq-shadow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="h-5 w-5" />
              <span>البحث والتصفية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ابحث في الفرص الاستثمارية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <div>
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

              {/* Location Filter */}
              <div>
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

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="created_at">الأحدث</option>
                  <option value="budget_desc">الميزانية (الأعلى)</option>
                  <option value="budget_asc">الميزانية (الأقل)</option>
                  <option value="roi_desc">العائد المتوقع</option>
                  <option value="popularity">الأكثر إعجاباً</option>
                  <option value="community_acceptance">القبول المجتمعي</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            عرض {filteredOpportunities.length} من أصل {opportunities.length} فرصة استثمارية
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="afaq-card afaq-hover-scale border-0 afaq-shadow overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {opportunity.sector}
                  </Badge>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{opportunity.community_acceptance}%</span>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight mb-2">
                  {opportunity.title}
                </CardTitle>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.location}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(opportunity.created_at)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 leading-relaxed line-clamp-3">
                  {opportunity.description}
                </CardDescription>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الاستثمار المطلوب:</span>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse font-semibold text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>{opportunity.budget_required.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  
                  {opportunity.expected_roi && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">العائد المتوقع:</span>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse font-semibold text-secondary">
                        <TrendingUp className="h-4 w-4" />
                        <span>{opportunity.expected_roi}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Heart className="h-4 w-4" />
                      <span>{opportunity.likes_count}</span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <MessageCircle className="h-4 w-4" />
                      <span>{opportunity.comments_count}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/opportunities/${opportunity.id}`} className="w-full">
                  <Button className="w-full afaq-gradient">
                    عرض التفاصيل
                    <Eye className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <Card className="afaq-card border-0 afaq-shadow text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد فرص مطابقة للبحث
              </h3>
              <p className="text-gray-500 mb-4">
                جرب تعديل معايير البحث أو التصفية للعثور على فرص أخرى
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSector('');
                  setSelectedLocation('');
                }}
                variant="outline"
              >
                إعادة تعيين البحث
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;

