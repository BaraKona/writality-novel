import { withProps } from '@udecode/cn';
import {
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate/react';
import { AIPlugin } from '@udecode/plate-ai/react';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  MentionInputPlugin,
  MentionPlugin,
} from '@udecode/plate-mention/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { copilotPlugins } from '@renderer/components/editor/plugins/copilot-plugins';
import { editorPlugins } from '@renderer/components/editor/plugins/editor-plugins';
import { FixedToolbarPlugin } from '@renderer/components/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '@renderer/components/editor/plugins/floating-toolbar-plugin';
import { AILeaf } from '@renderer/components/plate-ui/ai-leaf';
import { BlockquoteElement } from '@renderer/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@renderer/components/plate-ui/code-block-element';
import { CodeLeaf } from '@renderer/components/plate-ui/code-leaf';
import { CodeLineElement } from '@renderer/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@renderer/components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@renderer/components/plate-ui/column-element';
import { ColumnGroupElement } from '@renderer/components/plate-ui/column-group-element';
import { CommentLeaf } from '@renderer/components/plate-ui/comment-leaf';
import { DateElement } from '@renderer/components/plate-ui/date-element';
import { EmojiInputElement } from '@renderer/components/plate-ui/emoji-input-element';
import { EquationElement } from '@renderer/components/plate-ui/equation-element';
import { ExcalidrawElement } from '@renderer/components/plate-ui/excalidraw-element';
import { HeadingElement } from '@renderer/components/plate-ui/heading-element';
import { HighlightLeaf } from '@renderer/components/plate-ui/highlight-leaf';
import { HrElement } from '@renderer/components/plate-ui/hr-element';
import { ImageElement } from '@renderer/components/plate-ui/image-element';
import { InlineEquationElement } from '@renderer/components/plate-ui/inline-equation-element';
import { KbdLeaf } from '@renderer/components/plate-ui/kbd-leaf';
import { LinkElement } from '@renderer/components/plate-ui/link-element';
import { MediaAudioElement } from '@renderer/components/plate-ui/media-audio-element';
import { MediaEmbedElement } from '@renderer/components/plate-ui/media-embed-element';
import { MediaFileElement } from '@renderer/components/plate-ui/media-file-element';
import { MediaPlaceholderElement } from '@renderer/components/plate-ui/media-placeholder-element';
import { MediaVideoElement } from '@renderer/components/plate-ui/media-video-element';
import { MentionElement } from '@renderer/components/plate-ui/mention-element';
import { MentionInputElement } from '@renderer/components/plate-ui/mention-input-element';
import { ParagraphElement } from '@renderer/components/plate-ui/paragraph-element';
import { withPlaceholders } from '@renderer/components/plate-ui/placeholder';
import { SlashInputElement } from '@renderer/components/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@renderer/components/plate-ui/table-cell-element';
import { TableElement } from '@renderer/components/plate-ui/table-element';
import { TableRowElement } from '@renderer/components/plate-ui/table-row-element';
import { TocElement } from '@renderer/components/plate-ui/toc-element';
import { ToggleElement } from '@renderer/components/plate-ui/toggle-element';

export const useCreateEditor = () => {
  return usePlateEditor({
    override: {
      components: withPlaceholders({
        [AIPlugin.key]: AILeaf,
        [AudioPlugin.key]: MediaAudioElement,
        [BlockquotePlugin.key]: BlockquoteElement,
        [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
        [CodeBlockPlugin.key]: CodeBlockElement,
        [CodeLinePlugin.key]: CodeLineElement,
        [CodePlugin.key]: CodeLeaf,
        [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
        [ColumnItemPlugin.key]: ColumnElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [CommentsPlugin.key]: CommentLeaf,
        [DatePlugin.key]: DateElement,
        [EmojiInputPlugin.key]: EmojiInputElement,
        [EquationPlugin.key]: EquationElement,
        [ExcalidrawPlugin.key]: ExcalidrawElement,
        [FilePlugin.key]: MediaFileElement,
        [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
        [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
        [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
        [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
        [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
        [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
        [HighlightPlugin.key]: HighlightLeaf,
        [HorizontalRulePlugin.key]: HrElement,
        [ImagePlugin.key]: ImageElement,
        [InlineEquationPlugin.key]: InlineEquationElement,
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
        [KbdPlugin.key]: KbdLeaf,
        [LinkPlugin.key]: LinkElement,
        [MediaEmbedPlugin.key]: MediaEmbedElement,
        [MentionInputPlugin.key]: MentionInputElement,
        [MentionPlugin.key]: MentionElement,
        [ParagraphPlugin.key]: ParagraphElement,
        [PlaceholderPlugin.key]: MediaPlaceholderElement,
        [SlashInputPlugin.key]: SlashInputElement,
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
        [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
        [TableCellHeaderPlugin.key]: TableCellHeaderElement,
        [TableCellPlugin.key]: TableCellElement,
        [TablePlugin.key]: TableElement,
        [TableRowPlugin.key]: TableRowElement,
        [TocPlugin.key]: TocElement,
        [TogglePlugin.key]: ToggleElement,
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
        [VideoPlugin.key]: MediaVideoElement,
      }),
    },
    plugins: [
      ...copilotPlugins,
      ...editorPlugins,
      FixedToolbarPlugin,
      FloatingToolbarPlugin,
    ],
    value: [
      {
        children: [{ text: 'Playground' }],
        type: 'h1',
      },
      {
        children: [
          { text: 'A rich-text editor with AI capabilities. Try the ' },
          { bold: true, text: 'AI commands' },
          { text: ' or use ' },
          { kbd: true, text: 'Cmd+J' },
          { text: ' to open the AI menu.' },
        ],
        type: ParagraphPlugin.key,
      },
    ],
  });
};
