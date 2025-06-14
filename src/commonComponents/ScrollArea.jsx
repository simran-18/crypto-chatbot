import React from "react";

function ScrollArea({ className = "", children, ...props }) {
  return (
    <div
      className={`relative overflow-auto rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
