import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Lock,
  Eye,
  Clock
} from 'lucide-react';

const NDAModal = ({ isOpen, onClose, onAccept, opportunity }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
      onClose();
    } catch (error) {
      console.error('Error accepting NDA:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl">اتفاقية عدم الإفشاء</CardTitle>
                  <CardDescription>حماية الملكية الفكرية</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Opportunity Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center space-x-2 rtl:space-x-reverse">
                <FileText className="h-4 w-4" />
                <span>معلومات المشروع</span>
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>العنوان:</strong> {opportunity.title}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>الموقع:</strong> {opportunity.location}
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Badge variant="secondary">{opportunity.sector}</Badge>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>محمي بالملكية الفكرية</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">تنبيه مهم</h4>
                  <p className="text-sm text-yellow-700">
                    هذا المشروع محمي بنظام الملكية الفكرية. للاطلاع على التفاصيل الكاملة، 
                    يجب عليك الموافقة على اتفاقية عدم الإفشاء أولاً.
                  </p>
                </div>
              </div>
            </div>

            {/* NDA Terms */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                <Lock className="h-4 w-4" />
                <span>شروط اتفاقية عدم الإفشاء</span>
              </h3>
              
              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3 border border-gray-200 rounded">
                  <h4 className="font-medium mb-2">1. السرية والكتمان</h4>
                  <p className="text-gray-600">
                    أتعهد بالحفاظ على سرية جميع المعلومات المتعلقة بهذا المشروع وعدم إفشائها 
                    لأي طرف ثالث دون موافقة كتابية مسبقة من صاحب المشروع.
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded">
                  <h4 className="font-medium mb-2">2. عدم الاستخدام غير المصرح</h4>
                  <p className="text-gray-600">
                    أتعهد بعدم استخدام أو نسخ أو تطوير أي فكرة أو معلومة من هذا المشروع 
                    لأغراض شخصية أو تجارية دون الحصول على تصريح رسمي.
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded">
                  <h4 className="font-medium mb-2">3. المسؤولية القانونية</h4>
                  <p className="text-gray-600">
                    أدرك أن مخالفة هذه الاتفاقية قد تعرضني للمساءلة القانونية والتعويضات 
                    وفقاً لقوانين المملكة العربية السعودية.
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded">
                  <h4 className="font-medium mb-2">4. التوثيق الرقمي</h4>
                  <p className="text-gray-600">
                    يتم توثيق موافقتي على هذه الاتفاقية رقمياً مع تسجيل التاريخ والوقت 
                    وعنوان IP الخاص بي لأغراض قانونية.
                  </p>
                </div>
              </div>
            </div>

            {/* IP Protection Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">حماية الملكية الفكرية</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    هذا المشروع محمي بختم رقمي فريد يتضمن:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• هاش تشفير SHA-256 للمحتوى</li>
                    <li>• طابع زمني للتسجيل</li>
                    <li>• ربط بهوية صاحب المشروع</li>
                    <li>• سجل رقمي غير قابل للتلاعب</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="mb-6">
              <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm">
                  أؤكد أنني قرأت وفهمت جميع شروط اتفاقية عدم الإفشاء وأوافق على الالتزام بها
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="sm:order-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!hasRead || isAccepting}
                className="afaq-gradient sm:order-2"
              >
                {isAccepting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    أوافق على الاتفاقية
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NDAModal;

