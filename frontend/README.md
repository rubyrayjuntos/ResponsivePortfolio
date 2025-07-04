# Ray Swan - Creative Portfolio

A blazing altar of code, creativity, and cosmic elegance. This portfolio showcases a multidisciplinary creative's work across development, art, and writing with a sophisticated neumorphic design system and dynamic theming.

## Features

### 🎨 Neumorphic Design System
- **Soft UI Aesthetics**: Extruded and inset elements with sophisticated shadow manipulation
- **Dynamic Theming**: Mood-based theme switching based on project emotions
- **Accessibility-First**: WCAG compliant with high-contrast mode support
- **Responsive Design**: Optimized for all device sizes

### 🔍 Advanced Filtering & Search
- **Faceted Search**: Multi-level filtering with real-time updates
- **Smart Categorization**: Filter by project type, tools, tags, and year
- **Search Functionality**: Full-text search across all project content
- **Dynamic Facets**: Context-aware filtering options

### 📱 User Experience
- **Persona-Driven Navigation**: Optimized paths for different user types (recruiters, art directors, publishers)
- **Grid & Masonry Layouts**: Adaptive layouts based on content type
- **Smooth Animations**: Hardware-accelerated transitions and hover effects
- **PWA Ready**: Progressive Web App capabilities

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Custom CSS with CSS Variables for theming
- **State Management**: React Context API
- **Build Tool**: Create React App
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── HomePage.js
│   │   ├── PortfolioPage.js
│   │   ├── ProjectDetail.js
│   │   ├── ProjectCard.js
│   │   ├── FilterSidebar.js
│   │   ├── AboutPage.js
│   │   └── ContactPage.js
│   ├── context/
│   │   ├── ThemeContext.js
│   │   └── FilterContext.js
│   ├── data/
│   │   ├── projects.json
│   │   ├── about.json
│   │   ├── skills.json
│   │   └── tags.json
│   ├── styles/
│   │   └── neumorphic.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Data Structure

### Projects (projects.json)
Each project contains:
- **Basic Info**: title, subtitle, description, year
- **Categorization**: type, tools, tags
- **Media**: thumbnail and gallery images
- **Links**: demo and GitHub URLs
- **Metadata**: highlight status, emotion for theming

### About (about.json)
Personal information including:
- Name and headline
- Bio and avatar
- Contact information
- Social media links
- Availability status

### Skills (skills.json)
Organized skill categories with proficiency levels:
- Digital Art
- Development
- Design

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `build/` directory, ready for deployment.

## Customization

### Adding New Projects

1. Edit `src/data/projects.json`
2. Add a new project object following the existing structure
3. Include project images in the appropriate directory
4. Update the media paths to match your file structure

### Modifying Themes

1. Edit `src/styles/neumorphic.css`
2. Modify the CSS custom properties in the `:root` and theme selectors
3. Add new themes by creating additional `[data-theme='theme-name']` blocks

### Updating Content

- **About Page**: Edit `src/data/about.json`
- **Skills**: Edit `src/data/skills.json`
- **Contact Info**: Update social links in `src/data/about.json`

## Design System

### Neumorphic Components

- **`.neumorphic-raised`**: Extruded elements with outward shadows
- **`.neumorphic-inset`**: Pressed elements with inward shadows
- **`.neumorphic-beveled`**: Combined raised and inset effects
- **`.btn-circular`**: Circular buttons with beveled edges
- **`.btn-pill`**: Pill-shaped buttons

### Color Variables

```css
--bg-primary: Background color
--bg-secondary: Secondary background
--text-primary: Main text color
--text-secondary: Secondary text
--accent-primary: Primary accent
--accent-secondary: Secondary accent
--shadow-light: Light shadow color
--shadow-dark: Dark shadow color
```

### Typography

- **Display Font**: `var(--font-display)` for headings
- **Body Font**: `var(--font-main)` for body text
- **Text Effects**: `.text-embossed` and `.text-engraved` for depth

## Performance Optimizations

- **CSS Variables**: Efficient theme switching without re-renders
- **React.memo**: Optimized component re-rendering
- **useMemo**: Cached filtering and faceting calculations
- **Lazy Loading**: Images load on demand
- **Hardware Acceleration**: GPU-accelerated animations

## Accessibility Features

- **WCAG 2.1 AA Compliance**: High contrast ratios and focus indicators
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects user motion preferences
- **High Contrast Mode**: Automatic adaptation to system settings

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

### Other Platforms
The build output is a standard static site that can be deployed to any hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact:
- Email: RayCSwan@yahoo.com
- GitHub: [@rubyrayjuntos](https://github.com/rubyrayjuntos)

---

Built with ❤️ and neumorphic design principles 