function Card({ className = "", children }) {
  return (
    <div
      className={`bg-white text-black flex flex-col gap-1 rounded-xl border-1 border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children }) {
  return (
    <div
      className={`flex justify-between items-start gap-1.5 px-6 py-6 ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ className = "", children }) {
  return (
    <h4 className={`text-lg font-semibold leading-none ${className}`}>
      {children}
    </h4>
  );
}

function CardDescription({ className = "", children }) {
  return <p className={`text-gray-500 text-sm ${className}`}>{children}</p>;
}

function CardAction({ className = "", children }) {
  return (
    <div
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ className = "", children }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardFooter({ className = "", children }) {
  return (
    <div className={`flex items-center px-6 pb-6 pt-6 border-t ${className}`}>
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
};
