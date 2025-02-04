

import { CursorOverlayPlugin } from '@udecode/plate-selection/react';

import { CursorOverlay } from '@renderer/components/plate-ui/cursor-overlay';

export const cursorOverlayPlugin = CursorOverlayPlugin.configure({
  render: {
    afterEditable: () => <CursorOverlay />,
  },
});
