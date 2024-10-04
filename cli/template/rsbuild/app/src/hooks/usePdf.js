import { translateUnit } from '@hl/utils'
import domtoimage from 'dom-to-image-more'
import { jsPDF as JsPDF } from 'jspdf'

/**
 * 将dom导出为pdf
 * @param {string} selector 选择器：需要导出为pdf的dom
 * @param {Function} [complete] 导出完成回调
 */
export default function usePdf(selector, complete) {
  const a4 = [210, 297]
  const a4_px = [translateUnit(a4[0], 'mm', 'px'), translateUnit(a4[1], 'mm', 'px')]
  const isExport = ref(false)
  let loading = null

  // 导出PDF
  async function downloadPdf(name) {
    const el = document.querySelector(selector)
    el.scrollTop = 0

    // 内容的宽高
    const contentWidth = el.clientWidth
    const contentHeight = el.scrollHeight

    // 一页的高度
    const page_height = a4_px[1] / a4_px[0] * contentWidth

    const svg = await domtoimage.toSvg(el, {
      width: contentWidth,
      height: contentHeight,
      bgcolor: 'white',
      style: {
        overflow: 'hidden',
      },
    })

    const img = new Image()
    img.style.width = `${contentWidth}px`
    img.style.hieght = `${contentHeight}px`
    img.src = svg

    img.onload = () => {
      const pdf = new JsPDF('p', 'pt', 'a4')

      // 当前渲染到的内容位置
      let renderedHeight = 0
      while (renderedHeight < contentHeight) {
        const _height = Math.min(page_height, contentHeight - renderedHeight)

        let page_canvas = document.createElement('canvas')
        page_canvas.width = contentWidth
        page_canvas.height = _height

        // 截取内容
        page_canvas.getContext('2d').drawImage(img, 0, renderedHeight, contentWidth, _height, 0, 0, contentWidth, _height)

        const dataUrl = page_canvas.toDataURL('image/jpeg', 1)

        // 销毁canvas
        page_canvas.getContext('2d').fillRect(0, 0, contentWidth, _height)
        page_canvas = null

        pdf.addImage(dataUrl, 'JPEG', 0, 0, translateUnit(a4[0], 'mm', 'pt'), translateUnit(_height, 'px', 'pt') / contentWidth * a4_px[0])

        renderedHeight += page_height

        if (renderedHeight < contentHeight) {
          pdf.addPage()
        }
      }

      pdf.save(name)
      complete && complete()
      isExport.value = false
      loading.close()
    }
  }
  async function exportPdf(fileName) {
    isExport.value = true
    loading = hl.message.loading('正在导出PDF，请稍后...')
    setTimeout(() => {
      downloadPdf(fileName)
    }, 1500)
  }
  return {
    isExport,
    exportPdf,
  }
}
