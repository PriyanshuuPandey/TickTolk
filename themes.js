const themes = {
    light: {
      '--bg-color': 'ffffff',
      '--text-color': '#000000',
    },
    dark: {
      '--bg-color': '#000000',
      '--text-color': 'ffffff',
    },
  };
  
  function applyTheme(themeName) {
    const theme = themes[themeName];
    Object.keys(theme).forEach((property) => {
      document.documentElement.style.setProperty(property, theme[property]);
    });
  }
  
  document.getElementById('theme-switcher').addEventListener('change', (event) => {
    applyTheme(event.target.value);
  });
  