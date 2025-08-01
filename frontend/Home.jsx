import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  MapPin, 
  Eye, 
  Heart, 
  MessageCircle,
  ArrowLeft,
  Star,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    total_opportunities: 0,
    total_votes: 0,
    total_comments: 0,
    sector_distribution: []
  });

  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchFeaturedOpportunities();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/opportunities/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFeaturedOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities?per_page=3');
      if (response.ok) {
        const data = await response.json();
        setFeaturedOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'حماية الملكية الفكرية',
      description: 'نظام متقدم لحماية الأفكار والمشاريع من خلال التوثيق الرقمي والاتفاقيات الذكية'
    },
    {
      icon: Users,
      title: 'مشاركة المجتمع',
      description: 'إشراك المجتمع المحلي في تقييم المشاريع وقياس مستوى القبول المجتمعي'
    },
    {
      icon: MapPin,
      title: 'خريطة تفاعلية',
      description: 'عرض الفرص الاستثمارية على خريطة حرارية تفاعلية لمنطقة عسير'
    },
    {
      icon: BarChart3,
      title: 'تحليلات ذكية',
      description: 'ذكاء اصطناعي لترشيح الفرص المناسبة حسب اهتمامات المستثمر وميزانيته'
    }
  ];

  const sectors = [
    { name: 'سياحة', color: 'bg-blue-500', count: 15 },
    { name: 'زراعة', color: 'bg-green-500', count: 12 },
    { name: 'عقارات', color: 'bg-purple-500', count: 8 },
    { name: 'تقنية', color: 'bg-orange-500', count: 6 },
    { name: 'تجارة', color: 'bg-pink-500', count: 10 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="afaq-hero-bg text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              أُفُق
              <span className="block text-2xl md:text-3xl font-normal mt-2 opacity-90">
                لآفاق استثمارية جديدة!
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              منصة ذكية متخصصة في عرض وتوثيق الفرص الاستثمارية داخل منطقة عسير
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                  استكشف الفرص
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                  انضم للمنصة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stats.total_opportunities}</div>
              <div className="text-gray-600">فرصة استثمارية</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">{stats.total_votes}</div>
              <div className="text-gray-600">تصويت مجتمعي</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-destructive mb-2">{stats.total_comments}</div>
              <div className="text-gray-600">تعليق وتقييم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">مميزات المنصة</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نوفر بيئة آمنة وشفافة للاستثمار في منطقة عسير مع حماية متقدمة للملكية الفكرية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="afaq-card afaq-hover-scale border-0 afaq-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">الفرص المميزة</h2>
              <p className="text-xl text-gray-600">
                اكتشف أحدث الفرص الاستثمارية في منطقة عسير
              </p>
            </div>
            <Link to="/opportunities">
              <Button variant="outline" className="hidden md:flex">
                عرض جميع الفرص
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="afaq-card afaq-hover-scale border-0 afaq-shadow overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {opportunity.sector}
                    </Badge>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{opportunity.community_acceptance}%</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{opportunity.title}</CardTitle>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">
                    {opportunity.description}
                  </CardDescription>
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
                    <div className="font-semibold text-primary">
                      {opportunity.budget_required?.toLocaleString()} ريال
                    </div>
                  </div>
                  <Link to={`/opportunities/${opportunity.id}`}>
                    <Button className="w-full afaq-gradient">
                      عرض التفاصيل
                      <Eye className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/opportunities">
              <Button variant="outline">
                عرض جميع الفرص
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sectors Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">القطاعات الاستثمارية</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تنوع في الفرص الاستثمارية عبر مختلف القطاعات في منطقة عسير
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {sectors.map((sector, index) => (
              <Card key={index} className="afaq-card afaq-hover-scale border-0 afaq-shadow text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${sector.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{sector.name}</h3>
                  <p className="text-2xl font-bold text-primary">{sector.count}</p>
                  <p className="text-sm text-gray-500">فرصة</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 afaq-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ رحلتك الاستثمارية اليوم
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            انضم إلى منصة أُفُق واكتشف الفرص الاستثمارية المميزة في منطقة عسير
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                إنشاء حساب مجاني
                <Zap className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/opportunities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                تصفح الفرص
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

