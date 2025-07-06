# Project Carousel Component

A neumorphic carousel component for displaying portfolio projects with smooth animations, tilt effects, and graphical slider controls.

## Features

- **Neumorphic Design**: Matches the portfolio's design system with soft shadows and depth
- **VanillaTilt Integration**: 3D tilt effects on project cards
- **Graphical Slider**: Custom slider track with animated thumb
- **Auto-play**: Optional automatic rotation with configurable intervals
- **Responsive**: Adapts to different screen sizes
- **Theme Integration**: Uses CSS custom properties for consistent theming
- **Accessibility**: ARIA labels and keyboard navigation support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filterByType` | string | null | Filter projects by type ID |
| `maxProjects` | number | 6 | Maximum number of projects to display |
| `showSlider` | boolean | true | Show/hide the slider controls |
| `autoPlay` | boolean | false | Enable automatic rotation |
| `autoPlayInterval` | number | 5000 | Auto-play interval in milliseconds |

## Usage Examples

### Basic Carousel
```jsx
import ProjectCarousel from './components/ProjectCarousel';

<ProjectCarousel />
```

### Filtered Carousel
```jsx
<ProjectCarousel 
  filterByType="game-design"
  maxProjects={4}
  autoPlay={true}
  autoPlayInterval={4000}
/>
```

### Compact View
```jsx
<ProjectCarousel 
  maxProjects={6}
  showSlider={false}
  autoPlay={false}
/>
```

## Integration with Portfolio Data

The component automatically integrates with your existing data structure:

- **Projects**: Reads from `src/data/projects.json`
- **Media**: Loads images from `src/data/media.json`
- **Types**: Gets project types from `src/data/types.json`
- **Themes**: Uses the theme context for consistent styling

## Styling

The component uses CSS custom properties defined in your neumorphic design system:

- `--bg-primary`, `--bg-secondary`: Background colors
- `--accent-primary`, `--accent-secondary`: Accent colors
- `--shadow-light`, `--shadow-dark`: Shadow colors
- `--radius-md`, `--radius-lg`: Border radius values
- `--transition-normal`: Transition timing

## Accessibility Features

- ARIA labels for navigation buttons
- Keyboard navigation support
- Reduced motion preferences respected
- High contrast mode support
- Screen reader friendly structure

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- VanillaTilt requires ES6+ support
- Graceful degradation for older browsers

## Performance

- Lazy loading for images
- Efficient scroll event handling
- Debounced auto-play intervals
- Optimized re-renders with React hooks 