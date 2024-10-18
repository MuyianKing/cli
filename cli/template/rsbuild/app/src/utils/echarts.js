// 引入柱状图图表，图表后缀都为 Chart
import {
  BarChart,
  EffectScatterChart,
  LineChart,
  LinesChart,
  PictorialBarChart,
  PieChart,
  SunburstChart,
  TreeChart,
  TreemapChart,
} from 'echarts/charts'

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'

import * as echarts from 'echarts/core'

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

export default function useEcharts() {
  // 注册必须的组件
  echarts.use([
    CanvasRenderer,
    LabelLayout,
    UniversalTransition,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    GeoComponent,
    BarChart,
    PieChart,
    PictorialBarChart,
    LinesChart,
    EffectScatterChart,
    LineChart,
    DataZoomComponent,
    TreeChart,
    TreemapChart,
    SunburstChart,
  ])
}
