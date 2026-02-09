/**
 * @fileoverview Language Selector Component
 * 
 * Allows users to switch between available languages.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { availableLanguages, changeLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
}) => {
  const { i18n } = useTranslation();

  const currentLanguage = availableLanguages.find(
    (lang) => lang.code === i18n.language
  ) || availableLanguages[0];

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && <span>{currentLanguage.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={
              language.code === i18n.language
                ? 'bg-accent font-medium'
                : ''
            }
          >
            <span className="mr-2">{language.nativeName}</span>
            <span className="text-muted-foreground text-xs">
              ({language.name})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
