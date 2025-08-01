import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <img src={logo} alt="أُفُق" className="h-12 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              منصة أُفُق هي منصة ذكية متخصصة في عرض وتوثيق الفرص الاستثمارية داخل منطقة عسير، 
              تعمل على حماية الملكية الفكرية وتعزيز الشفافية وإشراك المجتمع المحلي في عملية التقييم والتطوير.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  الفرص الاستثمارية
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  الخريطة التفاعلية
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-gray-300">أبها، منطقة عسير، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-gray-300" dir="ltr">+966 17 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-gray-300">info@afaq-asir.sa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 منصة أُفُق. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                شروط الاستخدام
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                سياسة ملفات تعريف الارتباط
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

