import { isOverflow } from '@hl/utils'

export default {
  name: 'HlTableBody',
  props: {
    hover: {
      type: String,
      default: 'default',
    },
    activeIndex: {
      type: [Number, String],
      default: '',
    },
    emptyText: {
      type: String,
      default: '没有数据',
    },
    rowClass: {
      type: Function,
      default() {
        return ''
      },
    },
    tooltipEffect: {
      type: String,
      default: 'light',
    },
    tooltopMaxWidth: {
      type: String,
      default: '30vw',
    },
  },
  setup(props, { emit, slots }) {
    const store = inject('hlTableStore')
    const columns = computed(() => store.value.columns)
    const data = computed(() => store.value.data)

    function rowClick(row, index) {
      emit('rowClick', row, index)
    }

    const tr_style = computed(() => ({
      cursor: props.hover,
    }))

    const tip_content = ref('')
    const visible = ref(false)
    const tip_index = ref(0)
    // 设置tip
    function setTips(e, index) {
      tip_index.value = index
      const dom = e.target
      if (isOverflow(dom)) {
        const { top, left } = dom.getBoundingClientRect()
        position.value = DOMRect.fromRect({
          width: 0,
          height: 0,
          x: left + dom.clientWidth / 2,
          y: top + 8 + (index > 0 ? 0 : dom.clientHeight),
        })

        tip_content.value = dom.textContent
        visible.value = true
      }
    }

    // 隐藏tip
    function hideTip() {
      visible.value = false
    }

    const position = ref({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    })

    return () => (
      <table class="hl-table-body" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          {
            data.value.map((row, index) => {
              const arr = [<tr
                className={`hl-table-tr${props.activeIndex !== '' && +props.activeIndex === index ? ' active' : ''} ${index % 2 === 0 ? '' : 'enev'} ${props.rowClass && props.rowClass(row, index)}`}
                onClick={() => {
                  rowClick(row, index)
                }}
                style={tr_style.value}
                           >
                {columns.value.filter(column => column.show).map(column => (
                  <td key={column.uuid} data-uuid={column.uuid} class={`hl-table-td ${column.className}`} style={column.tdStyle} onMouseenter={e => setTips(e, index)} onMouseleave={hideTip}>
                    {column.render({
                      row,
                      index,
                    })}
                  </td>
                ))}
                           </tr>,
              ]

              if (slots.extend) {
                arr.push(
                  <tr className={`${index % 2 === 0 ? '' : 'enev'}`}>
                    <td className="extend-td" colSpan={columns.value.length}>
                      {slots.extend({
                        row,
                        index,
                      })}
                    </td>
                  </tr>,
                )
              }

              return arr
            })
          }

          {data.value.length === 0 && (
            <tr>
              <td class="hl-table-td hl-table-no-data" colSpan={columns.value.length}>
                没有数据
              </td>
            </tr>
          )}

        </tbody>
      </table>
    )
  },
}
