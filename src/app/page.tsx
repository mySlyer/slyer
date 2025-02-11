export default function Page() {
  return (
    <article className="flex flex-1 h-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Stay tuned</h3>
          <p className="text-sm text-muted-foreground">
            This page is still under construction.
          </p>
        </div>
      </div>
    </article>
  );
}
