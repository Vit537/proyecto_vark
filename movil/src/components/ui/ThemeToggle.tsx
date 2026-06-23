import React from 'react';
import { Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export default function ThemeToggle() {
  const { theme, name, toggleTheme } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={8}
      style={{
        width: 38, height: 38, borderRadius: radius.sm,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.bgGlass, borderWidth: 1, borderColor: theme.borderGlass,
      }}
    >
      <MotiView
        key={name}
        from={{ opacity: 0, rotate: '-90deg' }}
        animate={{ opacity: 1, rotate: '0deg' }}
        transition={{ type: 'timing', duration: 200 }}
      >
        {name === 'dark'
          ? <Moon size={16} color={theme.accentCyan} />
          : <Sun size={16} color={theme.warning} />}
      </MotiView>
    </Pressable>
  );
}
