import './scss/thead.scss'

export default {
  name: 'HlTableHead',
  setup(props, { emit }) {
    const store = inject('hlTableStore')
    const columns = computed(() => store.value.columns)

    const align_map = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    }

    function spanClick(column, index) {
      emit('span-click', column, index)
    }

    return () => (
      <table class="hl-table-header" cellspacing="0" cellpadding="0" border="0">
        <thead>
          <tr className="hl-table-tr">
            {columns.value.filter(column => column.show).map((column, index) => (
              <th
                class={`hl-table-td hl-table-th ${column.className}`}
                style={column.thStyle}
                key={column.uuid}
                onClick={() => {
                  spanClick(column, index)
                }}
              >
                <div class="hl-table-td-div" style={{ justifyContent: align_map[column.style.textAlign] }}>
                  <span style={{ verticalAlign: 'middle', textAlign: column.style.textAlign }}>
                    {column.label}
                  </span>
                  {column.renderHeader && column.renderHeader()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      </table>
    )
  },
}
