import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from "react";
import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";

import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Divider from "@yoopta/divider";
import Blockquote from "@yoopta/blockquote";
import Code from "@yoopta/code";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import Callout from "@yoopta/callout";
import Table from "@yoopta/table";

import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';

// Tools should be defined outside component
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
const plugins = [HeadingOne, HeadingTwo, HeadingThree, Paragraph, Blockquote, Image, Link, Table, Divider, Callout, NumberedList, BulletedList, TodoList, Code];

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

export const Route = createLazyFileRoute('/world/details')({
  component: RouteComponent,
})

function RouteComponent() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div className='w-full  grow'>
      <div className='max-w-screen-md mx-auto'>
        <YooptaEditor
          editor={editor}
          className='w-full grow'
          plugins={plugins}
          placeholder="Type something"
          value={value}
          width="100%"
          onChange={onChange}
          tools={TOOLS}
          marks={MARKS}
        />
      </div>
    </div>
  )
}
