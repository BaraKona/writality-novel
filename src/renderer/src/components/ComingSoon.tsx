export const ComingSoon = (): JSX.Element => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center border rounded-xl -mt-24 p-4 bg-accent max-w-md">
        <h2 className="text-lg font-medium mb-2">Coming Soon</h2>
        <p className="text-sm text-muted-foreground text-center">
          Writality is still under development. This feature is coming soon.
        </p>
      </div>
    </div>
  );
};
