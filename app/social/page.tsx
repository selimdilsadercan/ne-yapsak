function SocialPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Friends & Groups</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <div className="rounded-lg border bg-card p-4 text-card-foreground">
          <p className="text-muted-foreground">Your friends will appear here.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Groups</h2>
        <div className="rounded-lg border bg-card p-4 text-card-foreground">
          <p className="text-muted-foreground">Your groups will appear here.</p>
        </div>
      </section>
    </div>
  );
}

export default SocialPage;
