# Fouad Search - Web Search Application

A mysterious dark-themed web search application with advanced search capabilities and journal article content.

## 🚀 Features

- **Advanced Search Engine**: Real-time search across 75+ pages of content
- **Boolean Operators**: Support for AND/OR operators for precise searches
  - `quantum AND physics` - Find pages containing both terms
  - `space OR astronomy` - Find pages containing either term
  - Default behavior searches for any matching word
- **Smart Filtering**: Filter results by title matches, meta tags, and content
- **Search Suggestions**: Auto-complete suggestions based on keywords and titles
- **Interactive Search Tips**: Helpful tips shown when focusing on search box
- **Dark Mysterious Theme**: Modern dark UI with purple/pink gradients and glowing effects
- **Image Loading States**: Shimmer loading animations for better UX
- **Responsive Design**: Mobile-friendly and adaptive layout
- **Academic Content**: 20+ real scientific journal articles and research papers

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: 
  - CSS Variables for theming
  - Flexbox & CSS Grid for layouts
  - Advanced animations and transitions
  - Backdrop filters and blur effects
  - Gradient backgrounds and glow effects
  - Custom scrollbar styling
- **Vanilla JavaScript (ES6+)**:
  - DOM manipulation
  - Async/await for asynchronous operations
  - DOMParser for HTML parsing
  - Promise.all for parallel page loading
  - Event delegation and handling

### Features Implementation
- **Search Algorithm**: 
  - Multi-field text matching (title, H1, H2, meta tags, content)
  - Boolean operators (AND/OR) for precise search control
  - Scoring system with prioritization
  - Exact word matching with regex patterns
  - Real-time filtering and sorting
- **Page Preloading**: Fetch API for loading all pages at startup
- **Dynamic Content**: Template literals for dynamic HTML generation
- **Image Lazy Loading**: Native lazy loading with loading states
- **Responsive Images**: Unsplash API integration for high-quality images

### Design System
- **Color Scheme**: Dark theme with purple (#a855f7) and pink (#ec4899) accents
- **Typography**: System font stack for optimal performance
- **Animations**: 
  - Fade-in effects
  - Slide animations
  - Shimmer loading states
  - Glow and shadow effects

## 📁 Project Structure

```
web-search/
├── index.html          # Main HTML file
├── style.css           # All styles and animations
├── script.js           # Search logic and functionality
├── README.md           # Project documentation
└── pages/              # Content pages (75 HTML files)
    ├── page1.html
    ├── page2.html
    ├── ...
    └── page75.html
```

## 🔧 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Fouadkerrouche/web-search.git
   cd web-search
   ```

2. **Open the application**:
   - Simply open `index.html` in a modern web browser
   - No build process or dependencies required
   - All resources are loaded locally or from CDN

3. **For development**:
   ```bash
   # Use any local server (optional)
   python -m http.server 8000
   # or
   npx serve
   ```

4. **Access the application**:
   - Open `http://localhost:8000` in your browser
   - Or directly open `index.html` file

## 📖 How to Use

1. **Basic Search**: Type keywords in the search box and press Enter or click Search button
2. **AND Operator**: Use `term1 AND term2` to find pages containing both terms
   - Example: `quantum AND physics` - Returns only pages with both words
3. **OR Operator**: Use `term1 OR term2` to find pages containing either term
   - Example: `space OR astronomy` - Returns pages with either word
4. **Filter Results**: Use filter buttons to narrow results by match type (All/Title/Meta/Content)
5. **View Details**: Click on any result card to open the full page in a new tab
6. **Quick Topics**: Click on popular topic chips for instant searches
7. **Clear Search**: Use the X button in the search box to reset
8. **Search Tips**: Focus on the search box to see helpful operator examples

## 🎨 Customization

### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #a855f7;
    --accent-color: #ec4899;
    /* Add your custom colors */
}
```

### Adding More Pages
1. Create new HTML file in `pages/` directory (e.g., `page76.html`)
2. Update `TOTAL_PAGES` constant in `script.js`
3. Follow the existing page structure with proper meta tags

### Modifying Search Algorithm
Edit the `performSearch()` function in `script.js` to adjust:
- Match scoring weights
- Search fields
- Filtering logic

## 📄 Content

The application includes:
- **Original Pages**: 55 pages with various photography and content themes
- **Journal Articles**: 20 pages featuring real scientific journal articles from:
  - Nature, Science Magazine, NEJM, The Lancet
  - IEEE, JAMA, Cell, PNAS
  - Physical Review Letters, Astrophysical Journal
  - JMLR, BMJ, Neuron, ACM Computing Surveys
  - Nature Climate Change, Psychological Science, JCO
  - Environmental Science & Technology, JAIR, Nature Biotechnology

## 🔒 License & Usage Rights

**COPYRIGHT © 2025 FOUAD KERROUCHE & OUSSAMA HEZOUAT. ALL RIGHTS RESERVED.**

This project and all associated files are proprietary and confidential.

### Restrictions:
- ❌ **NOT FOR EDUCATIONAL USE**: This software may not be used for educational purposes, training, or academic projects
- ❌ **NOT FOR COMMERCIAL USE**: This software may not be used for any commercial purposes, revenue generation, or business operations
- ❌ **NO REDISTRIBUTION**: This software may not be copied, distributed, or shared in any form
- ❌ **NO MODIFICATION**: This software may not be modified, adapted, or used as a basis for derivative works
- ❌ **NO PUBLIC DEPLOYMENT**: This software may not be deployed publicly or made available to others

### Prohibited Activities:
- Using this code in educational institutions or courses
- Selling or licensing this software
- Including this code in other projects (open source or proprietary)
- Creating similar products based on this code
- Hosting this application on public servers
- Using this application for business purposes

**UNAUTHORIZED USE, REPRODUCTION, OR DISTRIBUTION IS STRICTLY PROHIBITED AND MAY RESULT IN LEGAL ACTION.**

For licensing inquiries, contact: [Your Contact Information]

## 👨‍💻 Team

**Project Owner**: Fouad Kerrouche
- GitHub: [@Fouadkerrouche](https://github.com/Fouadkerrouche)

**Developer**: Oussama Hezouat
- GitHub: [@oussamahezouat](https://github.com/oussamahezouat)

## 📝 Version History

- **v1.1.0** (December 2025)
  - Added AND/OR boolean operators for advanced search
  - Interactive search tips panel
  - Improved search algorithm with operator support
  - Updated UI with helpful examples
- **v1.0.0** (December 2025)
  - Initial release
  - 75 searchable pages
  - Dark mysterious theme
  - Advanced search functionality
  - 20 scientific journal articles

---

**Note**: This is a proprietary project. All rights reserved. Unauthorized use is prohibited.
