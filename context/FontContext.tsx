import React, { createContext, useState, useContext } from 'react';

// 폰트 이름 리터럴 타입 선언
export type FontName = 'system' | 'roboto' | 'noto-sans';

// 사용 가능한 폰트 목록 (키 타입 제한)
export const AVAILABLE_FONTS: Record<FontName, string> = {
  system: 'System',
  roboto: 'Roboto',
  'noto-sans': 'Noto Sans',
};

// 폰트 스타일 타입
export type FontStyle = {
  regular: string;
  bold: string;
};

// 폰트 스타일 매핑 (키 타입 제한)
const FONT_STYLES: Record<FontName, FontStyle> = {
  system: {
    regular: 'System',
    bold: 'System',
  },
  roboto: {
    regular: 'Roboto-Regular',
    bold: 'Roboto-Bold',
  },
  'noto-sans': {
    regular: 'NotoSans-Regular',
    bold: 'NotoSans-Bold',
  },
};

// 컨텍스트 타입
type FontContextType = {
  currentFont: FontName;
  setFont: (font: FontName) => void;
  fontStyle: FontStyle;
  fontsLoaded: boolean;
  availableFonts: typeof AVAILABLE_FONTS;
};

// 컨텍스트 생성
const FontContext = createContext<FontContextType | undefined>(undefined);

// 폰트 프로바이더 컴포넌트
export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFont, setCurrentFont] = useState<FontName>('system');
  const [fontsLoaded, setFontsLoaded] = useState(true); // 실제로는 폰트 로딩 상태를 관리해야 함
  
  // 현재 폰트 스타일
  const fontStyle = FONT_STYLES[currentFont];
  
  // 폰트 변경 함수 (FontName 타입으로 제한)
  const setFont = (font: FontName) => {
    setCurrentFont(font);
  };
  
  return (
    <FontContext.Provider value={{
      currentFont,
      setFont,
      fontStyle,
      fontsLoaded,
      availableFonts: AVAILABLE_FONTS,
    }}>
      {children}
    </FontContext.Provider>
  );
};

// 폰트 컨텍스트 사용 훅
export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    // 컨텍스트가 없을 때 기본값 반환
    return {
      currentFont: 'system' as FontName,
      setFont: () => {},
      fontStyle: FONT_STYLES['system'],
      fontsLoaded: true,
      availableFonts: AVAILABLE_FONTS,
    };
  }
  return context;
};
