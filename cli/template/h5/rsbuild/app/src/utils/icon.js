import { ICONIFY_API } from '@app'
import { addAPIProvider, disableCache, enableCache } from '@iconify/vue'

export default function () {
  addAPIProvider('', {
    resources: [ICONIFY_API],
  })

  disableCache('local')
  enableCache('session')
}
