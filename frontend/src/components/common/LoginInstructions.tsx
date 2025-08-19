import React from 'react';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

const LoginInstructions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 mb-6">
      <Alert 
        type="info" 
        message={
          <div>
            <p className="font-semibold mb-2">{t('auth.demo_accounts')}</p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>{t('auth.admin_account')}:</strong><br />
                Email: admin@sucurries.com<br />
                Password: admin123
              </div>
              <div>
                <strong>{t('auth.customer_account')}:</strong><br />
                Email: user@sucurries.com<br />
                Password: user123
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default LoginInstructions;