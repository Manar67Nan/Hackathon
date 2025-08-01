import React from 'react';
import { Badge } from './ui/badge';
import { Shield, Clock, Hash, User } from 'lucide-react';

const IPProtectionBadge = ({ opportunity, showDetails = false }) => {
  if (!opportunity.is_protected) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showDetails) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-800">محمي بالملكية الفكرية</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-700">
            <Clock className="h-4 w-4" />
            <span>تاريخ التسجيل: {formatDate(opportunity.ip_timestamp)}</span>
          </div>
          
          {opportunity.ip_hash && (
            <div className="flex items-start space-x-2 rtl:space-x-reverse text-green-700">
              <Hash className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block">الختم الرقمي:</span>
                <code className="text-xs bg-green-100 px-2 py-1 rounded mt-1 block break-all">
                  {opportunity.ip_hash.substring(0, 32)}...
                </code>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-700">
            <User className="h-4 w-4" />
            <span>مسجل باسم: صاحب المشروع</span>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
          <strong>ملاحظة:</strong> هذا المشروع محمي بنظام التوثيق الرقمي. 
          أي محاولة لنسخ أو استخدام المحتوى دون إذن قد تعرض للمساءلة القانونية.
        </div>
      </div>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className="bg-green-100 text-green-800 border-green-300 flex items-center space-x-1 rtl:space-x-reverse"
    >
      <Shield className="h-3 w-3" />
      <span>محمي</span>
    </Badge>
  );
};

export default IPProtectionBadge;

