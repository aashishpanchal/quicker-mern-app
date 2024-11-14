// default theme
export const Theme = {
  colors: {
    // main colors
    bg: '#FFFFFF',
    surface: '#F2F2F2',
    primary: '#0D0AB6',
    placeholder: '#A0A0A0',
    onPrimary: '#FFFFFF',
    text: '#363636',
    disabled: '#E0E0E0',
    // pallets colors
    gray: '#808080',
    white: '#FFFFFF',
    black: '#000000',
  },
  fonts: {
    /** @font-weight: 700 */
    bold: 'MonaSans-Bold',
    /** @font-weight: 600 */
    semiBold: 'MonaSans-SemiBold',
    /** @font-weight: 500 */
    medium: 'MonaSans-Medium',
    /** @font-weight: 400 */
    regular: 'MonaSans-Regular',
  },
  spaces: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 64,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 10,
  },
  // sizes
  icon: 24,
  height: 40,
} as const;
