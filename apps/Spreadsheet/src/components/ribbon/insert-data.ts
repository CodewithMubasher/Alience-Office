/**
 * The Insert tab's data, ported from the reference project:
 * `src/ui/shapes.js` (SHAPES), `src/core/chart-subtypes.js` (CHART_GALLERIES)
 * and `src/core/equation.js` (BUILTIN_EQUATIONS). Only static data lives here;
 * the layout is in insert-ribbon.tsx and the primitives in ribbon-kit.tsx.
 */

/* ---------- Insert ▸ Illustrations ▸ Shapes (ui/shapes.js) ---------- */

/** The two colours the reference's shape drawings paint with. */
const FILL = "#3a78d0"
const LINE = "#2a5ea8"

export type ShapeTile = {
  label: string
  svg: string
  viewBox?: string
}

/** The gallery, in the reference's own order, grouped by kind. */
export const SHAPE_GROUPS: Array<{ name: string; shapes: ShapeTile[] }> = [
  {
    name: "Lines",
    shapes: [
      {
        label: "Line",
        viewBox: "0 0 100 20",
        svg: `<line x1="2" y1="10" x2="98" y2="10" stroke="${LINE}" stroke-width="3"/>`,
      },
      {
        label: "Arrow",
        viewBox: "0 0 100 20",
        svg: `<line x1="2" y1="10" x2="86" y2="10" stroke="${LINE}" stroke-width="3"/><polygon points="84,3 98,10 84,17" fill="${LINE}"/>`,
      },
    ],
  },
  {
    name: "Rectangles",
    shapes: [
      {
        label: "Rectangle",
        svg: `<rect x="2" y="2" width="96" height="96" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Rounded Rectangle",
        svg: `<rect x="2" y="2" width="96" height="96" rx="16" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
    ],
  },
  {
    name: "Basic Shapes",
    shapes: [
      {
        label: "Oval",
        svg: `<ellipse cx="50" cy="50" rx="48" ry="48" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Triangle",
        svg: `<polygon points="50,2 98,98 2,98" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Diamond",
        svg: `<polygon points="50,2 98,50 50,98 2,50" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Pentagon",
        svg: `<polygon points="50,2 98,38 80,98 20,98 2,38" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Hexagon",
        svg: `<polygon points="25,2 75,2 98,50 75,98 25,98 2,50" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Heart",
        svg: `<path d="M50 94C18 70 2 52 2 30 2 14 14 4 28 4c10 0 18 6 22 14C54 10 62 4 72 4c14 0 26 10 26 26 0 22-16 40-48 64z" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
    ],
  },
  {
    name: "Block Arrows",
    shapes: [
      {
        label: "Right Arrow",
        svg: `<polygon points="2,30 62,30 62,6 98,50 62,94 62,70 2,70" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Left Arrow",
        svg: `<polygon points="98,30 38,30 38,6 2,50 38,94 38,70 98,70" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Up Arrow",
        svg: `<polygon points="30,98 30,38 6,38 50,2 94,38 70,38 70,98" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
      {
        label: "Down Arrow",
        svg: `<polygon points="30,2 30,62 6,62 50,98 94,62 70,62 70,2" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
    ],
  },
  {
    name: "Stars and Banners",
    shapes: [
      {
        label: "Star: 5 Points",
        svg: `<polygon points="50,3 61,37 97,37 68,59 79,94 50,72 21,94 32,59 3,37 39,37" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
    ],
  },
  {
    name: "Callouts",
    shapes: [
      {
        label: "Speech Bubble: Rectangle",
        svg: `<path d="M4 4h92v64H40l-20 26 4-26H4z" fill="${FILL}" stroke="${LINE}" stroke-width="2"/>`,
      },
    ],
  },
]

/* ---------- Insert ▸ Charts (core/chart-subtypes.js) ---------- */

export type ChartSubtype = { label: string; glyph: string }
export type ChartGalleryGroup = { header: string; items: ChartSubtype[] }
export type ChartGallery = {
  label: string
  glyph: string
  /** The family's own page of the All Charts list (ui/chart-ribbon.js). */
  more: string
  groups: ChartGalleryGroup[]
}

/** One button per family, each holding its subtypes as a tile gallery. */
export const CHART_GALLERIES: ChartGallery[] = [
  {
    label: "Column",
    glyph: "chartColumn",
    more: "More column chart types…",
    groups: [
      {
        header: "Column",
        items: [
          { label: "Clustered Column", glyph: "chartColumnClustered" },
          { label: "Stacked Column", glyph: "chartColumnStacked" },
          { label: "100% Stacked Column", glyph: "chartColumnStacked100" },
        ],
      },
    ],
  },
  {
    label: "Line",
    glyph: "chartLine",
    more: "More line chart types…",
    groups: [
      {
        header: "Line",
        items: [
          { label: "Line", glyph: "chartLinePlain" },
          { label: "Stacked Line", glyph: "chartLineStacked" },
          { label: "100% Stacked Line", glyph: "chartLineStacked100" },
          { label: "Line with Markers", glyph: "chartLineMarkers" },
          {
            label: "Stacked Line with Markers",
            glyph: "chartLineStackedMarkers",
          },
          {
            label: "100% Stacked Line with Markers",
            glyph: "chartLineStacked100Markers",
          },
        ],
      },
    ],
  },
  {
    label: "Pie",
    glyph: "chartPie",
    more: "More pie chart types…",
    groups: [
      {
        header: "Pie",
        items: [
          { label: "Pie", glyph: "chartPie" },
          { label: "Exploded Pie", glyph: "chartPieExploded" },
          { label: "Pie of Pie", glyph: "chartPieOfPie" },
          { label: "Bar of Pie", glyph: "chartBarOfPie" },
        ],
      },
      {
        header: "Doughnut",
        items: [
          { label: "Doughnut", glyph: "chartDoughnut" },
          { label: "Exploded Doughnut", glyph: "chartDoughnutExploded" },
        ],
      },
    ],
  },
  {
    label: "Bar",
    glyph: "chartBar",
    more: "More bar chart types…",
    groups: [
      {
        header: "Bar",
        items: [
          { label: "Clustered Bar", glyph: "chartBarClustered" },
          { label: "Stacked Bar", glyph: "chartBarStacked" },
          { label: "100% Stacked Bar", glyph: "chartBarStacked100" },
        ],
      },
    ],
  },
  {
    label: "Area",
    glyph: "chartArea",
    more: "More area chart types…",
    groups: [
      {
        header: "Area",
        items: [
          { label: "Area", glyph: "chartArea" },
          { label: "Stacked Area", glyph: "chartAreaStacked" },
          { label: "100% Stacked Area", glyph: "chartAreaStacked100" },
        ],
      },
    ],
  },
  {
    label: "Scatter",
    glyph: "chartScatter",
    more: "More scatter chart types…",
    groups: [
      {
        header: "Scatter",
        items: [
          { label: "Scatter", glyph: "chartScatter" },
          {
            label: "Scatter, smooth lines and markers",
            glyph: "chartScatterSmoothMarkers",
          },
          { label: "Scatter, smooth lines", glyph: "chartScatterSmooth" },
          {
            label: "Scatter, straight lines and markers",
            glyph: "chartScatterLinesMarkers",
          },
          {
            label: "Scatter, straight lines",
            glyph: "chartScatterLines",
          },
        ],
      },
      {
        header: "Bubble",
        items: [{ label: "Bubble", glyph: "chartBubble" }],
      },
    ],
  },
  {
    label: "Hierarchy",
    glyph: "chartTreemap",
    more: "More hierarchy charts…",
    groups: [
      { header: "Treemap", items: [{ label: "Treemap", glyph: "chartTreemap" }] },
      { header: "Sunburst", items: [{ label: "Sunburst", glyph: "chartSunburst" }] },
    ],
  },
  {
    label: "Statistic",
    glyph: "chartBoxWhisker",
    more: "More statistical charts…",
    groups: [
      {
        header: "Histogram",
        items: [{ label: "Histogram", glyph: "chartHistogram" }],
      },
      {
        header: "Box and Whisker",
        items: [{ label: "Box and Whisker", glyph: "chartBoxWhisker" }],
      },
    ],
  },
  {
    label: "Other Charts",
    glyph: "chartStockOhlc",
    more: "More chart types…",
    groups: [
      {
        header: "Waterfall and Funnel",
        items: [
          { label: "Waterfall", glyph: "chartWaterfall" },
          { label: "Funnel", glyph: "chartFunnel" },
        ],
      },
      {
        header: "Stock",
        items: [
          { label: "High-Low-Close", glyph: "chartStockHlc" },
          { label: "Open-High-Low-Close", glyph: "chartStockOhlc" },
          { label: "Volume-High-Low-Close", glyph: "chartStockVhlc" },
          {
            label: "Volume-Open-High-Low-Close",
            glyph: "chartStockVohlc",
          },
        ],
      },
      {
        header: "Surface",
        items: [
          { label: "3-D Surface", glyph: "chartSurface" },
          { label: "Wireframe 3-D Surface", glyph: "chartSurfaceWireframe" },
          { label: "Contour", glyph: "chartContour" },
          { label: "Wireframe Contour", glyph: "chartContourWireframe" },
        ],
      },
      {
        header: "Radar",
        items: [
          { label: "Radar", glyph: "chartRadar" },
          { label: "Radar with Markers", glyph: "chartRadarMarkers" },
          { label: "Filled Radar", glyph: "chartRadarFilled" },
        ],
      },
    ],
  },
  {
    label: "Combo",
    glyph: "chartCombo",
    more: "More combo charts…",
    groups: [
      {
        header: "Combo",
        items: [
          { label: "Column and line", glyph: "chartCombo" },
          {
            label: "Column and line, line on a second axis",
            glyph: "chartComboSecondary",
          },
        ],
      },
    ],
  },
]

/* ---------- Insert ▸ Symbols ▸ Equation (core/equation.js) ---------- */

/** The built-in equations the split's arrow offers, each drawn in the reference. */
export const BUILTIN_EQUATIONS: Array<{ label: string }> = [
  { label: "Area of Circle" },
  { label: "Binomial Theorem" },
  { label: "Expansion of a Sum" },
  { label: "Fourier Series" },
  { label: "Pythagorean Theorem" },
  { label: "Quadratic Formula" },
  { label: "Taylor Expansion" },
  { label: "Trig Identity 1" },
  { label: "Trig Identity 2" },
]
