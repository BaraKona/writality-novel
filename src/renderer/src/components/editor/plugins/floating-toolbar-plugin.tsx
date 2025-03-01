'use client'

import { FloatingToolbar } from '@renderer/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@renderer/components/plate-ui/floating-toolbar-buttons'
import { createPlatePlugin } from '@udecode/plate/react'

export const FloatingToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    )
  }
})
