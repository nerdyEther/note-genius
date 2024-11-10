'use client'

import { useMyPresence, useOthers } from "@liveblocks/react"
import { PointerEvent } from 'react'
import FollowPointer from './FollowPointer'

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {others.map(({ connectionId, presence, info }) => (
        presence.cursor && (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        )
      ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider